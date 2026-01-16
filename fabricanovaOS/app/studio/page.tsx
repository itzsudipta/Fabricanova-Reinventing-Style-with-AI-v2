'use client';

// --- IMPORTS ---
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Settings, Wifi, LogOut, User, Shield } from 'lucide-react';

// --- COMPONENTS ---
import Toolbar from '@/component/studio/Toolbar';
import CanvasBoard from '@/component/studio/CanvasBoard';
import AIPromptPanel from '@/component/studio/AIPromptPanel';
import ResultReveal from '@/component/studio/ResultReveal';
import LayersPanel from '@/component/studio/LayersPanel';

// --- UTILS ---
const base64ToBlob = async (base64: string): Promise<Blob> => {
  const res = await fetch(base64);
  return res.blob();
};

export default function StudioPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- STATE ---
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Studio State
  const [viewMode, setViewMode] = useState<'canvas' | 'result'>('canvas');
  const [serverUrl, setServerUrl] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Canvas State
  const [activeTool, setActiveTool] = useState('pen');
  const [brushSize, setBrushSize] = useState(3);
  const [opacity, setOpacity] = useState(100);
  const [canvasData, setCanvasData] = useState<string | null>(null);

  // Input State
  const [sketchSource, setSketchSource] = useState<'canvas' | 'upload'>('canvas');
  const [uploadedSketch, setUploadedSketch] = useState<File | null>(null);
  const [uploadedSketchPreview, setUploadedSketchPreview] = useState<string | null>(null);
  const [fabricFile, setFabricFile] = useState<File | null>(null);
  const [fabricPreview, setFabricPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');

  // Result State
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [lookbookBase64, setLookbookBase64] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);

  // --- INITIALIZATION ---
  useEffect(() => {
    const initData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth'); return; }
      setUser(user);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);
      setLoadingUser(false);
    };

    initData();

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [supabase, router]);

  // --- HANDLERS ---
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSketchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedSketch(file);
      setUploadedSketchPreview(URL.createObjectURL(file));
      setSketchSource('upload');
    }
  };

  const handleFabricUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFabricFile(file);
      setFabricPreview(URL.createObjectURL(file));
    }
  };

  const handleFabricDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFabricFile(file);
      setFabricPreview(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!serverUrl) {
      setShowSettings(true);
      alert("⚠️ Please configure your AI Backend URL first.");
      return;
    }

    setIsGenerating(true);
    setViewMode('result');

    try {
      const formData = new FormData();
      formData.append('prompt', prompt);

      if (sketchSource === 'canvas' && canvasData) {
        const blob = await base64ToBlob(canvasData);
        formData.append('sketch', blob, 'canvas_sketch.png');
      } else if (sketchSource === 'upload' && uploadedSketch) {
        formData.append('sketch', uploadedSketch);
      }

      if (fabricFile) {
        formData.append('swatch', fabricFile);
      }

      let finalUrl = serverUrl.trim();
      if (finalUrl.endsWith('/')) finalUrl = finalUrl.slice(0, -1);
      if (!finalUrl.endsWith('/generate')) finalUrl += '/generate';

      const response = await fetch(finalUrl, {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "69420" },
        body: formData
      });

      const data = await response.json();

      if (data.status === "success") {
        setResultImage(data.image);
        setLookbookBase64(data.lookbook);
        setPalette(data.palette);
      } else {
        alert("AI Error: " + (data.message || "Unknown error"));
        setViewMode('canvas');
      }
    } catch (e) {
      console.error(e);
      alert("❌ Connection Failed. Check Ngrok URL.");
      setViewMode('canvas');
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = !!(prompt || (sketchSource === 'canvas' && canvasData) || fabricFile);

  if (loadingUser) return <div className="h-screen flex items-center justify-center bg-stone-50">Loading Studio...</div>;

  return (
    // Fixed: Added overflow-hidden to body but allowed internal flex scrolling
    <div className="h-screen flex flex-col bg-stone-50 font-sans text-stone-900 overflow-hidden">

      {/* HEADER */}
      {/* Fixed: Adjusted padding for mobile (px-4) */}
      <header className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-4 md:px-6 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-serif text-lg md:text-xl font-bold italic">Fabricanova</Link>
          <div className="h-6 w-px bg-stone-200"></div>
          <div className="flex bg-stone-100 rounded-lg p-1">
            <button onClick={() => setViewMode('canvas')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'canvas' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500'}`}>Studio</button>
            <button onClick={() => setViewMode('result')} disabled={!resultImage && !isGenerating} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'result' ? 'bg-purple-600 text-white shadow-sm' : 'text-stone-400'}`}>Results</button>
          </div>
        </div>

        {/* RIGHT TOOLS & MENU */}
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-stone-900 px-2 md:px-3 py-1.5 rounded-full border border-transparent hover:border-stone-200 transition-colors">
            {serverUrl ? <Wifi size={14} className="text-green-500" /> : <Wifi size={14} className="text-red-400" />}
            <span className="hidden sm:inline">{serverUrl ? 'AI Online' : 'Connect AI'}</span>
          </button>

          {/* PROFILE DROPDOWN */}
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
      {/* Fixed: Changed positioning to fit mobile screens (right-4 instead of right-20, max-w) */}
      {showSettings && (
        <div className="absolute top-16 right-4 md:right-20 z-[60] bg-white p-4 rounded-xl shadow-xl border border-stone-200 w-80 max-w-[90vw] animate-in fade-in slide-in-from-top-2">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2"><Settings size={12} /> AI Backend Config</h3>
          <input type="text" value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} placeholder="https://xxxx.ngrok-free.app" className="w-full text-xs p-2.5 border border-stone-300 rounded mb-2" />
          <div className="flex justify-end"><button onClick={() => setShowSettings(false)} className="text-xs bg-stone-900 text-white px-4 py-1.5 rounded">Save</button></div>
        </div>
      )}

      {/* === MAIN LAYOUT === */}
      {/* Fixed: flex-col for mobile, flex-row for desktop. Added overflow-y-auto so mobile can scroll. */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative z-0">

        {/* LEFT SIDEBAR: INPUTS */}
        {/* Fixed: Wrapped AIPromptPanel to handle responsive width and order */}
        <div className="order-2 lg:order-1 w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-stone-200 bg-white">
          <AIPromptPanel
            sketchSource={sketchSource}
            setSketchSource={setSketchSource}
            uploadedSketchPreview={uploadedSketchPreview}
            onSketchUpload={handleSketchUpload}
            fabricPreview={fabricPreview}
            onFabricUpload={handleFabricUpload}
            onFabricDrop={handleFabricDrop}
            onClearFabric={() => { setFabricFile(null); setFabricPreview(null); }}
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            canGenerate={canGenerate}
          />
        </div>

        {/* CENTER STAGE */}
        {/* Fixed: Added min-h for mobile so canvas doesn't collapse. Added touch-none for better drawing. order-1 ensures canvas is top on mobile. */}
        <div className="order-1 lg:order-2 flex-1 relative flex items-center justify-center bg-stone-100 overflow-hidden min-h-[50vh] lg:min-h-0 touch-none">
          {/* Canvas View */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${viewMode === 'canvas' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <Toolbar activeTool={activeTool} setActiveTool={setActiveTool} />
            <div className="relative shadow-xl shadow-stone-300/50 border border-white bg-white">
              <CanvasBoard
                activeTool={activeTool}
                brushSize={brushSize}
                opacity={opacity}
                importedImage={sketchSource === 'upload' ? uploadedSketchPreview : null}
                onDrawEnd={(data) => setCanvasData(data)}
              />
            </div>
          </div>
          {/* Result View */}
          <div className={`absolute inset-0 flex items-center justify-center bg-stone-50 transition-opacity duration-300 ${viewMode === 'result' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <ResultReveal
              resultImage={resultImage}
              palette={palette}
              lookbookBase64={lookbookBase64}
              onBack={() => setViewMode('canvas')}
              isGenerating={isGenerating}
            />
          </div>
        </div>

        {/* RIGHT SIDEBAR: LAYERS (Visible only in Canvas Mode) */}
        {/* Fixed: Responsive width (w-full on mobile). Order-3 places it at bottom of mobile stack. */}
        {viewMode === 'canvas' && (
          <div className="order-3 w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-stone-200 bg-white shrink-0">
            <LayersPanel />
          </div>
        )}

      </main>
    </div>
  );
}