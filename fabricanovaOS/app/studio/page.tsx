'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Undo, Redo, Download, Sparkles, Layers,
  Sliders, ChevronRight, Settings,
  Wifi, CheckCircle2, AlertCircle, Upload
} from 'lucide-react';
import Toolbar from '@/component/studio/Toolbar';
import CanvasBoard from '@/component/studio/CanvasBoard';

export default function StudioPage() {
  // --- STATE ---
  const [activeTool, setActiveTool] = useState('pen');
  const [brushSize, setBrushSize] = useState(3);
  const [opacity, setOpacity] = useState(100);
  const [importedImage, setImportedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [prompt, setPrompt] = useState('');
  const [sketchData, setSketchData] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [serverUrl, setServerUrl] = useState('');
  const [showSettings, setShowSettings] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // --- HELPER: ROBUST DOWNLOAD FUNCTION ---
  const downloadBase64 = (base64Data: string, fileName: string) => {
    console.log(`📥 Attempting to download: ${fileName}`);
    try {
      const link = document.createElement('a');
      link.href = base64Data;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("✅ Download triggered successfully.");
    } catch (e) {
      console.error("❌ Download failed:", e);
      alert("Download failed. Please try right-clicking the image and selecting 'Save Image As'.");
    }
  };

  // --- HANDLERS ---

  // 1. Upload Image
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

  // 2. Export Canvas Button Handler
  const handleExportCanvas = () => {
    console.log("🖱️ Export Canvas Clicked");
    if (!sketchData) {
      console.warn("⚠️ SketchData is null. Canvas hasn't initialized yet.");
      alert("Canvas is initializing... please wait a second or draw something first.");
      return;
    }
    downloadBase64(sketchData, 'fabricanova-sketch.png');
  };

  // 3. Download AI Button Handler
  const handleDownloadAI = () => {
    console.log("🖱️ Download AI Clicked");
    if (!generatedImage) {
      alert("No AI image generated yet!");
      return;
    }
    downloadBase64(generatedImage, 'fabricanova-ai-render.png');
  };

  // 4. Generate AI Design Handler
  const handleGenerate = async () => {
    if (!serverUrl) { alert("⚠️ Please paste your Colab Ngrok URL!"); setShowSettings(true); return; }
    if (!sketchData) { alert("⚠️ Please draw something or upload a sketch!"); return; }
    if (!prompt) { alert("⚠️ Please enter a text prompt!"); return; }

    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-stone-100 overflow-hidden font-sans text-stone-900">

      {/* Header */}
      <header className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:bg-stone-100 p-2 rounded-md">
            <div className="font-serif font-bold text-lg">Fabricanova</div>
          </Link>
          <div className="h-6 w-px bg-stone-200" />
          <div className="text-sm font-medium text-stone-500">SS26 Collection / Draft 04</div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border ${connectionStatus === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
            connectionStatus === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
              'bg-stone-50 border-stone-200 text-stone-500'
            }`}>
            <Wifi size={12} />
            {connectionStatus === 'success' ? 'AI Online' : connectionStatus === 'error' ? 'Offline' : 'Ready'}
          </div>
          <button className="p-2 hover:bg-stone-50 rounded text-stone-500"><Undo size={18} /></button>
          <button className="p-2 hover:bg-stone-50 rounded text-stone-500"><Redo size={18} /></button>

          {/* EXPORT CANVAS BUTTON */}
          <button
            onClick={handleExportCanvas}
            className="ml-4 bg-stone-900 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-stone-800 flex items-center gap-2 transition-colors cursor-pointer"
          >
            Export Canvas <Download size={14} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <aside className="w-80 bg-white border-r border-stone-200 flex flex-col z-10 p-5 overflow-y-auto">
          {/* Settings */}
          <div className="mb-6 bg-stone-50 border border-stone-200 rounded-lg p-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 hover:text-stone-800"
            >
              <span className="flex items-center gap-2"><Settings size={12} /> AI Server Config</span>
              <ChevronRight size={12} className={`transition-transform ${showSettings ? 'rotate-90' : ''}`} />
            </button>
            {showSettings && (
              <div className="animate-fade-in-up">
                <p className="text-[10px] text-stone-400 mb-2 leading-snug">Paste <strong>Ngrok URL</strong> from Colab:</p>
                <input
                  type="text" placeholder="https://xxxx.ngrok-free.app"
                  value={serverUrl} onChange={(e) => setServerUrl(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded mb-1 focus:ring-1 focus:ring-stone-900 outline-none bg-white"
                />
                <div className="flex items-center gap-1 text-[10px] text-stone-400">
                  {serverUrl.includes('ngrok') ? <CheckCircle2 size={10} className="text-green-500" /> : <AlertCircle size={10} />}
                  {serverUrl.includes('ngrok') ? 'Valid format' : 'Waiting for URL...'}
                </div>
              </div>
            )}
          </div>

          {/* Import Source */}
          <div className="mb-6 border-b border-stone-100 pb-6">
            <h3 className="text-xs font-bold tracking-wider text-stone-400 uppercase mb-3 flex items-center gap-2">Input Source</h3>
            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 bg-stone-100 border border-stone-200 text-stone-600 rounded text-xs font-bold uppercase tracking-wider hover:bg-stone-200 hover:border-stone-300 transition-all flex items-center justify-center gap-2"
            >
              <Upload size={14} /> Import Sketch / Photo
            </button>
          </div>

          {/* Prompt */}
          <div className="mb-6">
            <h3 className="text-xs font-bold tracking-wider text-stone-400 uppercase mb-3 flex items-center gap-2"><Sparkles size={12} /> Design Prompt</h3>
            <textarea
              className="w-full h-32 p-3 bg-stone-50 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-stone-900 outline-none resize-none transition-all placeholder:text-stone-400"
              placeholder="E.g. A futuristic oversized bomber jacket..."
              value={prompt} onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`w-full mt-4 text-white py-2.5 rounded text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-all ${isLoading ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 hover:bg-stone-800'}`}
            >
              {isLoading ? <span className="flex items-center gap-2">Generating... <Sparkles className="animate-spin" size={14} /></span> : <>Generate Design <ChevronRight size={14} /></>}
            </button>
          </div>

          {/* AI Output (With Download Button) */}
          {generatedImage && (
            <div className="pt-6 border-t border-stone-100 animate-fade-in-up">
              <h3 className="text-xs font-bold tracking-wider text-stone-400 uppercase mb-3">AI Output</h3>
              <div className="relative aspect-square border border-stone-200 rounded-lg overflow-hidden shadow-sm">
                <Image src={generatedImage} fill alt="AI Result" className="object-cover" />
              </div>

              {/* DOWNLOAD AI BUTTON */}
              <button
                onClick={handleDownloadAI}
                className="w-full mt-2 text-xs font-medium text-stone-500 hover:text-stone-900 border border-stone-200 hover:border-stone-900 rounded py-2 transition-colors cursor-pointer"
              >
                Download AI Image
              </button>
            </div>
          )}
        </aside>

        {/* Center Canvas */}
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

        {/* Right Panel */}
        <aside className="w-72 bg-white border-l border-stone-200 z-10 flex flex-col">
          <div className="flex-1 p-5 border-b border-stone-200 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold tracking-wider text-stone-400 uppercase flex items-center gap-2"><Layers size={12} /> Layers</h3>
              <button className="text-xs text-stone-500 hover:text-stone-900 font-medium">+ New</button>
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-between group cursor-pointer shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white border border-stone-300 rounded flex items-center justify-center"><span className="text-[10px] font-bold">V</span></div>
                  <div className="text-sm font-medium text-stone-900">Active Layer</div>
                </div>
              </div>
            </div>
          </div>

          {/* TOOL PROPERTIES (UPDATED SLIDERS) */}
          <div className="h-1/2 p-5 bg-stone-50/50">
            <h3 className="text-xs font-bold tracking-wider text-stone-400 uppercase mb-6 flex items-center gap-2"><Sliders size={12} /> Tool Properties</h3>
            <div className="space-y-6">
              {/* Brush Size Slider (Max 50) */}
              <div>
                <div className="flex justify-between text-xs font-medium text-stone-600 mb-2"><span>Stroke Weight</span><span>{brushSize}px</span></div>
                <input
                  type="range"
                  min="1"
                  max="50" // Updated to 50
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full accent-stone-900 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Opacity Slider (Min 1) */}
              <div>
                <div className="flex justify-between text-xs font-medium text-stone-600 mb-2"><span>Opacity</span><span>{opacity}%</span></div>
                <input
                  type="range"
                  min="1" // Updated to 1
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(parseInt(e.target.value))}
                  className="w-full accent-stone-900 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}