'use client';

// --- IMPORTS ---
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import {
  Undo, Redo, Download, Sparkles, Layers,
  Sliders, ChevronRight, Settings,
  Wifi, CheckCircle2, AlertCircle, Upload,
  LogOut, User, Shield, ChevronDown
} from 'lucide-react';

// --- CUSTOM COMPONENTS ---
import Toolbar from '@/component/studio/Toolbar';
import CanvasBoard from '@/component/studio/CanvasBoard';

export default function StudioPage() {
  const router = useRouter();

  // --- 1. SUPABASE & AUTH STATE ---
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // --- 2. CANVAS & TOOL STATE ---
  const [activeTool, setActiveTool] = useState('pen');
  const [brushSize, setBrushSize] = useState(3);
  const [opacity, setOpacity] = useState(100);
  const [importedImage, setImportedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 3. AI & SERVER STATE ---
  const [prompt, setPrompt] = useState('');
  const [sketchData, setSketchData] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [serverUrl, setServerUrl] = useState('');
  const [showSettings, setShowSettings] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // --- EFFECT: INITIALIZE ---
  useEffect(() => {
    const initData = async () => {
      // Check Session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      setUser(user);

      // Fetch Profile Details
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);
      setLoadingUser(false);
    };

    initData();

    // Click Outside Handler for Menu
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, [supabase, router]);

  // --- HANDLERS ---

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setImportedImage(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadBase64 = (base64Data: string, fileName: string) => {
    try {
      const link = document.createElement('a');
      link.href = base64Data;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert("Download failed.");
    }
  };

  const handleExportCanvas = () => {
    if (!sketchData) {
      alert("Please draw something first.");
      return;
    }
    downloadBase64(sketchData, 'fabricanova-sketch.png');
  };

  const handleDownloadAI = () => {
    if (!generatedImage) {
      alert("No AI image generated yet!");
      return;
    }
    downloadBase64(generatedImage, 'fabricanova-ai-render.png');
  };

  const handleGenerate = async () => {
    if (!serverUrl) { alert("⚠️ Please paste your Colab Ngrok URL!"); setShowSettings(true); return; }
    if (!sketchData) { alert("⚠️ Please draw something or upload a sketch!"); return; }
    if (!prompt) { alert("⚠️ Please enter a text prompt!"); return; }

    setIsGenerating(true);
    setConnectionStatus('idle');

    let finalUrl = serverUrl.trim();
    if (finalUrl.endsWith('/')) finalUrl = finalUrl.slice(0, -1);
    if (!finalUrl.endsWith('/generate')) finalUrl = finalUrl + '/generate';

    try {
      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({ prompt: prompt, image: sketchData })
      });

      const data = await response.json();

      if (data.status === "success") {
        setGeneratedImage(data.image);
        setConnectionStatus('success');
      } else {
        alert("AI Error: " + data.message);
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error(error);
      setConnectionStatus('error');
      alert("❌ Network Error: Could not connect to Colab.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loadingUser) return (
    <div className="h-screen w-full flex items-center justify-center bg-stone-50">
      <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-stone-50 overflow-hidden font-sans text-stone-900">

      {/* =========================================================================
          TOP HEADER (BRAND, TOOLS, & PROFILE MENU)
         ========================================================================= */}
      <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 z-50 shrink-0">

        {/* LEFT: Logo & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <div className="w-8 h-8 bg-stone-950 text-white flex items-center justify-center rounded-md font-serif font-bold italic">F</div>
            <span className="font-serif text-xl font-bold text-stone-900 hidden md:block">Fabricanova</span>
          </Link>
          <div className="h-8 w-px bg-stone-200"></div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Project</span>
            <span className="text-sm font-medium text-stone-900">SS26 / Draft 04</span>
          </div>
        </div>

        {/* RIGHT: Tools & Profile */}
        <div className="flex items-center gap-3">

          {/* Status & Basic Tools */}
          <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border ${connectionStatus === 'success' ? 'bg-green-50 border-green-200 text-green-700' : connectionStatus === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-stone-50 border-stone-200 text-stone-500'}`}>
            <Wifi size={12} />
            {connectionStatus === 'success' ? 'AI Online' : connectionStatus === 'error' ? 'Offline' : 'Ready'}
          </div>

          <div className="h-6 w-px bg-stone-200 mx-2 hidden md:block"></div>

          <button className="p-2 hover:bg-stone-100 rounded text-stone-500"><Undo size={18} /></button>
          <button className="p-2 hover:bg-stone-100 rounded text-stone-500"><Redo size={18} /></button>

          <button onClick={handleExportCanvas} className="bg-stone-100 text-stone-900 px-4 py-2 rounded text-sm font-medium hover:bg-stone-200 flex items-center gap-2 transition-colors">
            Export <Download size={14} />
          </button>

          <div className="h-6 w-px bg-stone-200 mx-2"></div>

          {/* --- PROFILE DROPDOWN --- */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-full border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-all"
            >
              <span className="text-xs font-bold text-stone-600 hidden sm:block">
                {profile?.full_name?.split(' ')[0] || "Designer"}
              </span>
              <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center overflow-hidden border border-stone-300">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-serif font-bold text-stone-500">{profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <ChevronDown size={14} className="text-stone-400 mr-1" />
            </button>

            {/* Dropdown Menu */}
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


      {/* =========================================================================
          MAIN WORKSPACE
         ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">

        {/* 1. INPUT PANEL (LEFT) */}
        <aside className="w-80 bg-white border-r border-stone-200 flex flex-col z-10 p-5 overflow-y-auto">

          {/* Server Config */}
          <div className="mb-6 bg-stone-50 border border-stone-200 rounded-lg p-3">
            <button onClick={() => setShowSettings(!showSettings)} className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 hover:text-stone-800">
              <span className="flex items-center gap-2"><Settings size={12} /> AI Server Config</span>
              <ChevronRight size={12} className={`transition-transform ${showSettings ? 'rotate-90' : ''}`} />
            </button>
            {showSettings && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="text-[10px] text-stone-400 mb-2 leading-snug">Paste <strong>Ngrok URL</strong> from Colab:</p>
                <input type="text" placeholder="https://xxxx.ngrok-free.app" value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} className="w-full text-xs p-2 border border-stone-300 rounded mb-1 focus:ring-1 focus:ring-stone-900 outline-none bg-white" />
                <div className="flex items-center gap-1 text-[10px] text-stone-400">
                  {serverUrl.includes('ngrok') ? <CheckCircle2 size={10} className="text-green-500" /> : <AlertCircle size={10} />}
                  {serverUrl.includes('ngrok') ? 'Valid format' : 'Waiting for URL...'}
                </div>
              </div>
            )}
          </div>

          {/* Upload */}
          <div className="mb-6 border-b border-stone-100 pb-6">
            <h3 className="text-xs font-bold tracking-wider text-stone-400 uppercase mb-3 flex items-center gap-2">Reference</h3>
            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 bg-stone-100 border border-stone-200 text-stone-600 rounded text-xs font-bold uppercase tracking-wider hover:bg-stone-200 transition-all flex items-center justify-center gap-2">
              <Upload size={14} /> Import Sketch
            </button>
          </div>

          {/* Prompt */}
          <div className="mb-6">
            <h3 className="text-xs font-bold tracking-wider text-stone-400 uppercase mb-3 flex items-center gap-2"><Sparkles size={12} /> Design Prompt</h3>
            <textarea className="w-full h-32 p-3 bg-stone-50 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-stone-900 outline-none resize-none transition-all placeholder:text-stone-400" placeholder="E.g. A futuristic oversized bomber jacket..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <button onClick={handleGenerate} disabled={isGenerating} className={`w-full mt-4 text-white py-2.5 rounded text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-all ${isGenerating ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-stone-800'}`}>
              {isGenerating ? <span className="flex items-center gap-2">Generating... <Sparkles className="animate-spin" size={14} /></span> : <>Generate Design <ChevronRight size={14} /></>}
            </button>
          </div>

          {/* AI Result */}
          {generatedImage && (
            <div className="pt-6 border-t border-stone-100 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xs font-bold tracking-wider text-stone-400 uppercase mb-3">AI Output</h3>
              <div className="relative aspect-square border border-stone-200 rounded-lg overflow-hidden shadow-sm">
                <Image src={generatedImage} fill alt="AI Result" className="object-cover" />
              </div>
              <button onClick={handleDownloadAI} className="w-full mt-2 text-xs font-medium text-stone-500 hover:text-stone-900 border border-stone-200 hover:border-stone-900 rounded py-2 transition-colors">
                Download AI Image
              </button>
            </div>
          )}
        </aside>

        {/* 2. CENTER CANVAS */}
        <main className="flex-1 bg-stone-100 relative overflow-hidden flex items-center justify-center">
          <Toolbar activeTool={activeTool} setActiveTool={setActiveTool} />
          <div className="relative group overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <CanvasBoard
              activeTool={activeTool}
              brushSize={brushSize}
              opacity={opacity}
              importedImage={importedImage}
              onDrawEnd={(data) => setSketchData(data)}
            />
          </div>
        </main>

        {/* 3. PROPERTIES PANEL (RIGHT) */}
        <aside className="w-72 bg-white border-l border-stone-200 z-10 flex flex-col">
          <div className="flex-1 p-5 border-b border-stone-200 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold tracking-wider text-stone-400 uppercase flex items-center gap-2"><Layers size={12} /> Layers</h3>
              <button className="text-xs text-stone-500 hover:text-stone-900 font-medium">+ New</button>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-between shadow-sm cursor-pointer border-l-4 border-l-stone-900">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white border border-stone-300 rounded flex items-center justify-center"><span className="text-[10px] font-bold">1</span></div>
                  <div className="text-sm font-medium text-stone-900">Sketch Layer</div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-1/2 p-5 bg-stone-50/50">
            <h3 className="text-xs font-bold tracking-wider text-stone-400 uppercase mb-6 flex items-center gap-2"><Sliders size={12} /> Tool Properties</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-medium text-stone-600 mb-2"><span>Stroke Weight</span><span>{brushSize}px</span></div>
                <input type="range" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-full accent-stone-900 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium text-stone-600 mb-2"><span>Opacity</span><span>{opacity}%</span></div>
                <input type="range" min="1" max="100" value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))} className="w-full accent-stone-900 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer" />
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}