'use client';

import { Sparkles, Layers, Upload, Image as ImageIcon, X, ChevronRight } from 'lucide-react';
import React from 'react';

interface AIPromptPanelProps {
    // Structure (Sketch) Props
    sketchSource: 'canvas' | 'upload';
    setSketchSource: (source: 'canvas' | 'upload') => void;
    uploadedSketchPreview: string | null;
    onSketchUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;

    // Material (Fabric) Props
    fabricPreview: string | null;
    onFabricDrop: (e: React.DragEvent) => void;
    onFabricUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearFabric: () => void;

    // Vision (Prompt) Props
    prompt: string;
    setPrompt: (text: string) => void;

    // Actions
    onGenerate: () => void;
    isGenerating: boolean;
    canGenerate: boolean;
}

export default function AIPromptPanel({
    sketchSource,
    setSketchSource,
    uploadedSketchPreview,
    onSketchUpload,
    fabricPreview,
    onFabricDrop,
    onFabricUpload,
    onClearFabric,
    prompt,
    setPrompt,
    onGenerate,
    isGenerating,
    canGenerate
}: AIPromptPanelProps) {

    const getButtonText = () => {
        if (isGenerating) return "Weaving Dreams...";
        const hasSketch = sketchSource === 'canvas' || uploadedSketchPreview;
        const hasFabric = !!fabricPreview;

        if (hasSketch && !hasFabric) return "Colorize Sketch";
        if (!hasSketch && hasFabric) return "Drape Fabric";
        if (hasSketch && hasFabric) return "Generate Design";
        return "Generate Design";
    };

    return (
        <aside className="w-80 bg-white border-r border-stone-200 flex flex-col z-30 h-full shadow-[5px_0_20px_-5px_rgba(0,0,0,0.05)]">

            {/* SCROLLABLE INPUT AREA */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">

                {/* === SECTION 1: VISION (Moved Top for Importance) === */}
                <div className="flex flex-col">
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Sparkles size={14} className="text-stone-400" /> Vision <span className="text-red-400">*</span>
                    </h3>
                    <textarea
                        className="w-full h-32 resize-none bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-stone-900 outline-none placeholder:text-stone-400 transition-all focus:bg-white"
                        placeholder="E.g. A futuristic oversized bomber jacket, metallic silver nylon, high fashion photography..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>

                <div className="h-px bg-stone-100 w-full"></div>

                {/* === SECTION 2: STRUCTURE (Sketch) === */}
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Structure</h3>
                        <div className="flex bg-stone-100 rounded p-0.5">
                            <button
                                onClick={() => setSketchSource('canvas')}
                                className={`px-2 py-0.5 text-[10px] rounded transition-all ${sketchSource === 'canvas' ? 'bg-white shadow-sm text-black font-medium' : 'text-stone-500'}`}
                            >
                                Canvas
                            </button>
                            <button
                                onClick={() => setSketchSource('upload')}
                                className={`px-2 py-0.5 text-[10px] rounded transition-all ${sketchSource === 'upload' ? 'bg-white shadow-sm text-black font-medium' : 'text-stone-500'}`}
                            >
                                Upload
                            </button>
                        </div>
                    </div>

                    <div className="w-full aspect-square bg-stone-50 border border-stone-200 border-dashed rounded-lg flex items-center justify-center relative overflow-hidden group hover:bg-stone-100 transition-colors">
                        {sketchSource === 'canvas' ? (
                            <div className="text-center p-2">
                                <Layers size={24} className="mx-auto text-stone-300 mb-1" />
                                <p className="text-[10px] text-stone-400 font-medium">Reading Active Canvas</p>
                                <p className="text-[9px] text-stone-300 mt-1">Draw on the center stage</p>
                            </div>
                        ) : (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onSketchUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                                {uploadedSketchPreview ? (
                                    <img src={uploadedSketchPreview} alt="Sketch" className="w-full h-full object-cover opacity-80" />
                                ) : (
                                    <div className="text-center group-hover:scale-105 transition-transform">
                                        <Upload size={24} className="mx-auto text-stone-300 mb-1" />
                                        <p className="text-[10px] text-stone-400 font-medium">Upload Sketch</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="h-px bg-stone-100 w-full"></div>

                {/* === SECTION 3: MATERIAL (Fabric) === */}
                <div className="flex flex-col">
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Material</h3>
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={onFabricDrop}
                        className="w-full h-32 bg-stone-50 border border-stone-200 border-dashed rounded-lg flex items-center justify-center relative overflow-hidden group hover:bg-stone-100 transition-colors"
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onFabricUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />

                        {fabricPreview ? (
                            <>
                                <img src={fabricPreview} alt="Fabric" className="w-full h-full object-cover" />
                                <button
                                    onClick={(e) => { e.preventDefault(); onClearFabric(); }}
                                    className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full text-stone-600 hover:text-red-500 z-20 shadow-sm"
                                >
                                    <X size={12} />
                                </button>
                            </>
                        ) : (
                            <div className="text-center group-hover:scale-105 transition-transform">
                                <ImageIcon size={24} className="mx-auto text-stone-300 mb-1" />
                                <p className="text-[10px] text-stone-400 font-medium">Drop Pattern / Texture</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* FIXED BOTTOM ACTION */}
            <div className="p-5 border-t border-stone-200 bg-white">
                <button
                    onClick={onGenerate}
                    disabled={!canGenerate || isGenerating}
                    className={`w-full py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all transform active:scale-95
            ${isGenerating
                            ? 'bg-stone-100 text-stone-400 cursor-wait'
                            : 'bg-stone-900 text-white hover:bg-black shadow-lg hover:shadow-stone-900/20'
                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
                >
                    {isGenerating ? <Sparkles className="animate-spin" size={16} /> : <Sparkles size={16} />}
                    <span>{getButtonText()}</span>
                </button>
            </div>
        </aside>
    );
}