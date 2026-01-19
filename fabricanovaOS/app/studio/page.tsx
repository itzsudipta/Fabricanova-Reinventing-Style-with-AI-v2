'use client';

// --- IMPORTS ---
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Settings, Wifi, LogOut, User, Shield, Save, Loader2, Layers, X, Scissors, Square, Circle, Hexagon, Minus, MousePointer2, Palette, Undo, Eraser } from 'lucide-react'; 
import { v4 as uuidv4 } from 'uuid';

// --- COMPONENTS ---
import Toolbar from '@/component/studio/Toolbar'; // Uses your new component
import CanvasBoard from '@/component/studio/CanvasBoard';
import AIPromptPanel from '@/component/studio/AIPromptPanel';
import ResultReveal from '@/component/studio/ResultReveal';
import LayersPanel from '@/component/studio/LayersPanel';

// --- CONSTANTS ---
const GARMENT_SHAPES = [
  { id: 'tshirt', label: 'T-Shirt', path: 'M4 4h16l-2 4v12H6V8L4 4z' },
  { id: 'shirt', label: 'Shirt', path: 'M12 2l-8 4v16h16V6l-8-4zm0 2l5 3H7l5-3z' },
  { id: 'blazer', label: 'Blazer', path: 'M4 4l2 16h12l2-16-4 6-4-6-4 6-4-6z' },
  { id: 'hoodie', label: 'Hoodie', path: 'M12 2a4 4 0 00-4 4v2H4l-1 4v10h18V12l-1-4h-4V6a4 4 0 00-4-4z' },
  { id: 'dress', label: 'Dress', path: 'M8 2l-4 6v14h16V8l-4-6H8z' },
  { id: 'gown', label: 'Gown', path: 'M12 2L5 8l1 14h12l1-14-7-6z' },
  { id: 'kurta', label: 'Kurta', path: 'M6 2L4 6v16h16V6l-2-4H6zm3 6h6v8H9V8z' },
  { id: 'skirt', label: 'Skirt', path: 'M6 4h12l4 16H2L6 4z' },
  { id: 'pants', label: 'Pants', path: 'M6 2h12v20h-4v-8h-4v8H6V2z' },
  { id: 'shorts', label: 'Shorts', path: 'M6 2h12v12h-4V9h-4v5H6V2z' },
];

const GEOMETRIC_SHAPES = [
    { id: 'line', label: 'Line', icon: Minus },
    { id: 'rect', label: 'Square', icon: Square },
    { id: 'circle', label: 'Circle', icon: Circle },
    { id: 'hexagon', label: 'Hexagon', icon: Hexagon },
];

const DEFAULT_PALETTE = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', 
    '#A52A2A', '#808080', '#D2B48C', '#FFC0CB', '#40E0D0'
];

// --- UTILS ---
const base64ToBlob = (base64Data: string, contentType: string = 'image/png'): Blob => {
  const base64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
  const byteCharacters = atob(base64);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) { byteNumbers[i] = slice.charCodeAt(i); }
    byteArrays.push(new Uint8Array(byteNumbers));
  }
  return new Blob(byteArrays, { type: contentType });
};

// --- COMPONENT: RIGHT PANEL COLOR PALETTE ---
const RightPanelPalette = ({ 
    colors, activeColor, onColorSelect 
}: { colors: string[], activeColor: string, onColorSelect: (c: string) => void }) => {
  return (
    <div className="p-4 border-b border-stone-200">
      <h3 className="text-xs font-bold text-stone-500 mb-3 flex items-center gap-2">
        <Palette size={14} /> STUDIO COLORS
      </h3>
      <div className="flex items-center gap-3 mb-4 p-2 bg-stone-50 rounded-lg border border-stone-100">
        <div className="w-8 h-8 rounded-full border border-stone-300 shadow-sm" style={{backgroundColor: activeColor}}></div>
        <div className="text-xs">
            <p className="text-stone-400 font-medium">Active Color</p>
            <p className="font-mono text-stone-600">{activeColor}</p>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color, idx) => (
          <button
            key={idx}
            onClick={() => onColorSelect(color)}
            className={`w-8 h-8 rounded-md transition-all ${activeColor === color ? 'ring-2 ring-stone-800 scale-110 z-10' : 'border border-stone-200 hover:scale-105'}`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};

export default function StudioPage() {
  const router = useRouter();
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  // --- STATE ---
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [viewMode, setViewMode] = useState<'canvas' | 'result'>('canvas');
  const [serverUrl, setServerUrl] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileLayers, setShowMobileLayers] = useState(false);

  // Tools & Canvas
  const [activeTool, setActiveTool] = useState<string>('pen');
  const [activeShape, setActiveShape] = useState<string | null>(null);
  const [shapeStamp, setShapeStamp] = useState<{id: string, path: string, timestamp: number} | null>(null);
  const [activeColor, setActiveColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState(5); 
  const [opacity, setOpacity] = useState(100);
  const [canvasData, setCanvasData] = useState<string | null>(null);
  const [undoTrigger, setUndoTrigger] = useState(0); 

  // Data & Results
  const [sketchSource, setSketchSource] = useState<'canvas' | 'upload'>('canvas');
  const [uploadedSketch, setUploadedSketch] = useState<File | null>(null);
  const [uploadedSketchPreview, setUploadedSketchPreview] = useState<string | null>(null);
  const [fabricFile, setFabricFile] = useState<File | null>(null);
  const [fabricPreview, setFabricPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [lookbookBase64, setLookbookBase64] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);

  // Array.from fixes the Set spread error
  const studioPalette = Array.from(new Set([...DEFAULT_PALETTE, ...palette]));

  useEffect(() => {
    const initData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth'); return; }
      setUser(user);
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(profileData);
      setLoadingUser(false);
    };
    initData();
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [supabase, router]);

  const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/'); };
  
  const handleShapeClick = (shape: typeof GARMENT_SHAPES[0]) => {
    setActiveTool('shape');
    setActiveShape(shape.id);
    setShapeStamp({ id: shape.id, path: shape.path, timestamp: Date.now() });
  };

  const handleSketchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setUploadedSketch(file); setUploadedSketchPreview(URL.createObjectURL(file)); setSketchSource('upload'); }
  };
  const handleFabricUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setFabricFile(file); setFabricPreview(URL.createObjectURL(file)); }
  };
  const handleFabricDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) { setFabricFile(file); setFabricPreview(URL.createObjectURL(file)); }
  };
  const uploadFileToStorage = async (file: Blob | File, bucket: string, path: string) => {
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true, contentType: 'image/png' });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };
  const saveDesignToDB = async (promptText: string, sketchUrl: string | null, swatchUrl: string | null, resultUrl: string | null, lookbookUrl: string | null, paletteColors: string[]) => {
    try {
      setIsSaving(true);
      await supabase.from('designs').insert({ user_id: user.id, prompt: promptText, sketch_url: sketchUrl, swatch_url: swatchUrl, image_url: resultUrl, lookbook_url: lookbookUrl, palette: paletteColors });
    } catch (err: any) { console.error(err); alert(`Save Failed: ${err.message}`); } finally { setIsSaving(false); }
  };

  const handleGenerate = async () => {
    if (!serverUrl) { setShowSettings(true); alert("⚠️ Configure AI Backend URL."); return; }
    setIsGenerating(true); setViewMode('result');
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      if (sketchSource === 'canvas' && canvasData) formData.append('sketch', base64ToBlob(canvasData), 'sketch.png');
      else if (sketchSource === 'upload' && uploadedSketch) formData.append('sketch', uploadedSketch);
      if (fabricFile) formData.append('swatch', fabricFile);
      
      let finalUrl = serverUrl.replace(/\/$/, '') + (serverUrl.endsWith('/generate') ? '' : '/generate');
      const response = await fetch(finalUrl, { method: "POST", headers: { "ngrok-skip-browser-warning": "69420" }, body: formData });
      const data = await response.json();
      
      if (data.status === "success") {
        setResultImage(data.image); setLookbookBase64(data.lookbook); setPalette(data.palette);
        (async () => {
            const designId = uuidv4();
            let finalSketchUrl = null, finalSwatchUrl = null, finalResultUrl = null, finalLookbookUrl = null;
            if (sketchSource === 'canvas' && canvasData) finalSketchUrl = await uploadFileToStorage(base64ToBlob(canvasData), 'studio-inputs', `${user.id}/${designId}_sketch.png`);
            else if (sketchSource === 'upload' && uploadedSketch) finalSketchUrl = await uploadFileToStorage(uploadedSketch, 'studio-inputs', `${user.id}/${designId}_sketch.png`);
            if (fabricFile) finalSwatchUrl = await uploadFileToStorage(fabricFile, 'studio-inputs', `${user.id}/${designId}_swatch.png`);
            if (data.image) finalResultUrl = await uploadFileToStorage(base64ToBlob(data.image), 'studio-outputs', `${user.id}/${designId}_result.png`);
            if (data.lookbook) finalLookbookUrl = await uploadFileToStorage(base64ToBlob(data.lookbook), 'studio-outputs', `${user.id}/${designId}_lookbook.png`);
            await saveDesignToDB(prompt, finalSketchUrl, finalSwatchUrl, finalResultUrl, finalLookbookUrl, data.palette);
        })();
      } else { alert("AI Error: " + data.message); setViewMode('canvas'); }
    } catch (e) { alert("❌ Connection Failed."); setViewMode('canvas'); } finally { setIsGenerating(false); }
  };

  const canGenerate = !!(prompt || (sketchSource === 'canvas' && canvasData) || fabricFile);
  if (loadingUser) return <div className="h-screen flex items-center justify-center bg-stone-50"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="h-screen flex flex-col bg-stone-50 font-sans text-stone-900 overflow-hidden">
      <style jsx global>{` .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } `}</style>

      {/* HEADER */}
      <header className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-3 md:px-6 z-50 shrink-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Link href="/" className="font-serif text-lg md:text-xl font-bold italic truncate">Fabricanova</Link>
          <div className="h-6 w-px bg-stone-200 hidden sm:block"></div>
          
          <div className="flex bg-stone-100 rounded-lg p-1 shrink-0">
            <button onClick={() => setViewMode('canvas')} className={`px-2.5 py-1 text-[11px] md:text-xs font-bold rounded-md transition-all ${viewMode === 'canvas' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>Studio</button>
            <button onClick={() => setViewMode('result')} disabled={!resultImage && !isGenerating} className={`px-2.5 py-1 text-[11px] md:text-xs font-bold rounded-md transition-all ${viewMode === 'result' ? 'bg-purple-600 text-white shadow-sm' : 'text-stone-400'}`}>Results</button>
          </div>
        </div>

        {/* RIGHT TOOLS & MENU */}
        <div className="flex items-center gap-2 md:gap-4">
          {viewMode === 'canvas' && (
            <button onClick={() => setShowMobileLayers(!showMobileLayers)} className="lg:hidden p-1.5 md:p-2 rounded-full hover:bg-stone-100 text-stone-600 border border-stone-200" title="Layers">
              <Layers size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          )}
          {isSaving && <span className="hidden md:flex text-xs text-stone-400 items-center gap-1 animate-pulse"><Save size={12} /> Saving...</span>}
          
          <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-stone-900 px-2 md:px-3 py-1.5 rounded-full border border-transparent hover:border-stone-200 transition-colors">
            {serverUrl ? <Wifi size={14} className="text-green-500" /> : <Wifi size={14} className="text-red-400" />}
            <span className="hidden sm:inline">{serverUrl ? 'AI Online' : 'Connect AI'}</span>
          </button>

          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden border border-stone-300 focus:ring-2 focus:ring-offset-1 focus:ring-stone-400">
              {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" /> : <span className="flex items-center justify-center h-full text-xs font-bold">{profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}</span>}
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                <div className="p-4 border-b border-stone-100 bg-stone-50/50">
                  <p className="text-sm font-bold text-stone-900 truncate">{profile?.full_name || user?.email}</p>
                  <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors">
                    <User size={16} /> View Profile
                  </Link>
                  {profile?.role === 'super_admin' && (
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Shield size={16} /> Admin Console
                    </Link>
                  )}
                  <div className="h-px bg-stone-100 my-1"></div>
                  <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="absolute top-16 right-4 md:right-20 z-[60] bg-white p-4 rounded-xl shadow-xl border border-stone-200 w-80 max-w-[90vw] animate-in fade-in slide-in-from-top-2">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Settings size={12} /> AI Backend Config</h3>
          <input type="text" value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} placeholder="https://xxxx.ngrok-free.app" className="w-full text-xs p-2.5 border border-stone-300 rounded mb-2" />
          <div className="flex justify-end"><button onClick={() => setShowSettings(false)} className="text-xs bg-stone-900 text-white px-4 py-1.5 rounded">Save</button></div>
        </div>
      )}

      {/* === MAIN LAYOUT === */}
      <main className="flex-1 w-full flex flex-col lg:flex-row bg-stone-50 overflow-y-auto lg:overflow-hidden relative z-0">

        {/* --- 1. CENTER: CANVAS --- */}
        <div className="order-1 lg:order-2 flex-1 w-full lg:h-full relative flex items-center justify-center bg-stone-100 overflow-hidden min-h-[50vh] lg:min-h-0 touch-none shrink-0 mb-6 lg:mb-0">
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${viewMode === 'canvas' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            
            {/* UNIFIED TOOLBAR PANEL */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3">
                {/* Main Bar: Tools + Actions in ONE CONTAINER */}
                <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-xl border border-stone-100 animate-in fade-in slide-in-from-top-4">
                    {/* The imported Toolbar */}
                    <div className="flex-shrink-0">
                        <Toolbar activeTool={activeTool} setActiveTool={setActiveTool} />
                    </div>

                    {/* Divider */}
                    <div className="w-px h-8 bg-stone-200 mx-1"></div>

                    {/* Undo Action */}
                    <button 
                        onClick={() => setUndoTrigger(t => t + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-stone-50 text-stone-600 transition-colors active:scale-95"
                        title="Undo"
                    >
                        <Undo size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Secondary Bar: Contextual Options (Size/Color) */}
                {['pen', 'eraser', 'line', 'rect', 'circle', 'hexagon'].includes(activeTool) && (
                    <div className="flex items-center gap-4 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-stone-100 animate-in slide-in-from-top-1">
                        {/* Size Control */}
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${activeTool === 'eraser' ? 'bg-stone-300' : 'bg-stone-800'}`}></div>
                            <input 
                                type="range" 
                                min="1" max="60" 
                                value={brushSize} 
                                onChange={(e) => setBrushSize(Number(e.target.value))}
                                className="w-24 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                            />
                        </div>

                        {/* Color Control (Hidden for eraser) */}
                        {activeTool !== 'eraser' && (
                            <>
                                <div className="w-px h-4 bg-stone-200"></div>
                                <div className="relative flex items-center group">
                                    <div className="w-6 h-6 rounded-full shadow-sm border border-stone-200 transition-transform group-hover:scale-110" style={{background: activeColor}}></div>
                                    <input 
                                        type="color" 
                                        value={activeColor} 
                                        onChange={(e) => setActiveColor(e.target.value)}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Main Canvas */}
            <div className="relative shadow-xl shadow-stone-300/50 border border-white bg-white">
              <CanvasBoard
                activeTool={activeTool}
                brushSize={brushSize}
                opacity={opacity}
                activeColor={activeColor}
                activeShape={activeShape}
                shapeStamp={shapeStamp}
                undoTrigger={undoTrigger}
                importedImage={sketchSource === 'upload' ? uploadedSketchPreview : null}
                onDrawEnd={setCanvasData}
              />
            </div>
          </div>

          {/* Result Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center bg-stone-50 transition-opacity duration-300 ${viewMode === 'result' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <ResultReveal resultImage={resultImage} palette={palette} lookbookBase64={lookbookBase64} onBack={() => setViewMode('canvas')} isGenerating={isGenerating} />
          </div>
        </div>

        {/* --- 2. LEFT SIDEBAR: SHAPES & PROMPT --- */}
        <div className="order-2 lg:order-1 w-full lg:w-80 lg:shrink-0 lg:h-full lg:overflow-y-auto no-scrollbar border-t lg:border-t-0 lg:border-r border-stone-200 bg-white">
          <div className="p-4 border-b border-stone-100">
             <button onClick={() => setActiveTool('select')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-bold transition-all ${activeTool === 'select' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}>
                <MousePointer2 size={16} /> Select / Move
             </button>
          </div>
          <div className="p-4 border-b border-stone-100">
             <h3 className="text-xs font-bold text-stone-400 mb-3 flex items-center gap-2"><Square size={12}/> BASIC SHAPES</h3>
             <div className="grid grid-cols-4 gap-2">
                {GEOMETRIC_SHAPES.map((shape) => (
                    <button key={shape.id} onClick={() => setActiveTool(shape.id)} className={`aspect-square flex flex-col items-center justify-center rounded-lg border transition-all ${activeTool === shape.id ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-stone-200 hover:bg-stone-50'}`}>
                        <shape.icon size={18} />
                    </button>
                ))}
             </div>
          </div>
          <div className="p-4 border-b border-stone-100">
            <h3 className="text-xs font-bold text-stone-400 mb-3 flex items-center gap-2"><Scissors size={12}/> FASHION ASSETS</h3>
            <div className="grid grid-cols-4 gap-2">
                {GARMENT_SHAPES.map((shape) => (
                    <button key={shape.id} onClick={() => handleShapeClick(shape)} className={`aspect-square flex flex-col items-center justify-center rounded-lg border transition-all ${activeShape === shape.id ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-stone-200 hover:bg-stone-50 text-stone-500'}`} title={shape.label}>
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d={shape.path}/></svg>
                        <span className="text-[9px] mt-1 font-medium">{shape.label}</span>
                    </button>
                ))}
            </div>
          </div>
          <AIPromptPanel sketchSource={sketchSource} setSketchSource={setSketchSource} uploadedSketchPreview={uploadedSketchPreview} onSketchUpload={handleSketchUpload} fabricPreview={fabricPreview} onFabricUpload={handleFabricUpload} onFabricDrop={handleFabricDrop} onClearFabric={() => { setFabricFile(null); setFabricPreview(null); }} prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} canGenerate={canGenerate} />
        </div>

        {/* --- 3. RIGHT SIDEBAR: LAYERS & COLOR PALETTE --- */}
        {viewMode === 'canvas' && (
          <div className="hidden lg:block lg:order-3 w-72 lg:h-full lg:shrink-0 border-l border-stone-200 bg-white">
            <RightPanelPalette colors={studioPalette} activeColor={activeColor} onColorSelect={setActiveColor} />
            <LayersPanel />
          </div>
        )}
        {showMobileLayers && (
            <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/50">
                <div className="bg-white w-full h-[80vh] rounded-t-xl overflow-hidden flex flex-col">
                    <div className="p-3 border-b flex justify-between"><span className="font-bold">Tools</span><button onClick={() => setShowMobileLayers(false)}><X/></button></div>
                    <div className="overflow-y-auto">
                        <RightPanelPalette colors={studioPalette} activeColor={activeColor} onColorSelect={setActiveColor} />
                        <LayersPanel />
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}