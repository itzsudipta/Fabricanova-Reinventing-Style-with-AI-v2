'use client';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIPromptPanel() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 2500);
    };

    return (
        <aside className="w-80 bg-white border-r border-stone-200 flex flex-col z-10">
            <div className="p-5 border-b border-stone-100">
                <h3 className="text-xs font-bold tracking-wider text-stone-400 uppercase mb-3 flex items-center gap-2">
                    <Sparkles size={12} /> Generative Prompt
                </h3>
                <textarea
                    className="w-full h-32 p-3 bg-stone-50 border border-stone-200 rounded text-sm focus:ring-1 focus:ring-stone-900 outline-none resize-none transition-all placeholder:text-stone-400"
                    placeholder="Describe your garment... e.g. A bohemian maxi dress, silk chiffon."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <select className="bg-stone-50 border border-stone-200 p-2 rounded text-xs text-stone-600 outline-none">
                        <option>Silk</option>
                        <option>Denim</option>
                        <option>Leather</option>
                    </select>
                    <select className="bg-stone-50 border border-stone-200 p-2 rounded text-xs text-stone-600 outline-none">
                        <option>Sketch</option>
                        <option>Realistic</option>
                    </select>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full mt-4 bg-stone-900 text-white py-2.5 rounded text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    {isGenerating ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                            <Sparkles size={14} />
                        </motion.div>
                    ) : (
                        <>Generate <Sparkles size={14} /></>
                    )}
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
                <h3 className="text-xs font-bold tracking-wider text-stone-400 uppercase mb-3">Assets</h3>
                <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-[3/4] bg-stone-50 rounded border border-stone-100 hover:border-stone-300 cursor-pointer transition-colors" />
                    ))}
                </div>
            </div>
        </aside>
    );
}