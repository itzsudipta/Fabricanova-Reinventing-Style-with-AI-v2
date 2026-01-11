'use client';
import { Layers, Sliders } from 'lucide-react';

export default function LayersPanel() {
    return (
        <aside className="w-72 bg-white border-l border-stone-200 z-10 flex flex-col">
            <div className="flex-1 p-5 border-b border-stone-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold tracking-wider text-stone-400 uppercase flex items-center gap-2">
                        <Layers size={12} /> Layers
                    </h3>
                </div>
                <div className="space-y-1">
                    <div className="p-2 rounded text-sm bg-stone-100 text-stone-900 font-medium flex items-center gap-2 cursor-pointer">
                        <div className="w-4 h-4 border border-stone-300 rounded bg-white" />
                        Sketch Layer
                    </div>
                    <div className="p-2 rounded text-sm text-stone-500 hover:bg-stone-50 flex items-center gap-2 cursor-pointer">
                        <div className="w-4 h-4 border border-stone-300 rounded bg-white" />
                        Base Silhouette
                    </div>
                </div>
            </div>
            <div className="h-1/2 p-5 bg-stone-50/50">
                <h3 className="text-xs font-bold tracking-wider text-stone-400 uppercase mb-4 flex items-center gap-2">
                    <Sliders size={12} /> Properties
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-stone-600 block mb-2">Stroke Weight</label>
                        <input type="range" className="w-full accent-stone-900 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer" />
                    </div>
                </div>
            </div>
        </aside>
    );
}