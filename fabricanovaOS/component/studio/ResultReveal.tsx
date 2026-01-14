'use client';

import { useState } from 'react';
import { Download, ArrowLeft } from 'lucide-react';

interface ResultRevealProps {
    resultImage: string | null;
    palette: string[];
    lookbookBase64: string | null;
    onBack: () => void;
    isGenerating: boolean;
}

export default function ResultReveal({
    resultImage,
    palette,
    lookbookBase64,
    onBack,
    isGenerating
}: ResultRevealProps) {
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const copyColor = (hex: string) => {
        navigator.clipboard.writeText(hex);
        setToastMsg(`Copied ${hex}!`);
        setTimeout(() => setToastMsg(null), 2000);
    };

    const downloadLookbook = () => {
        if (!lookbookBase64) return;
        const link = document.createElement('a');
        link.href = `data:image/jpeg;base64,${lookbookBase64}`;
        link.download = 'Fabricanova_Lookbook.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isGenerating) {
        return (
            <div className="flex flex-col items-center gap-4 animate-in fade-in duration-700">
                <div className="w-12 h-12 border-4 border-stone-200 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="text-stone-500 font-medium animate-pulse">Consulting the digital atelier...</p>
            </div>
        );
    }

    if (!resultImage) {
        return <div className="text-stone-400 text-sm">No design generated yet.</div>;
    }

    return (
        <div className="flex flex-col items-center w-full max-w-4xl h-full p-6 animate-in zoom-in-95 duration-500">

            {/* 1. Main Image Stage */}
            <div className="relative flex-1 w-full flex items-center justify-center mb-6">
                <div className="relative h-full aspect-[3/4] max-h-[55vh] shadow-2xl shadow-stone-200 rounded-lg overflow-hidden bg-white border border-stone-100">
                    <img src={`data:image/png;base64,${resultImage}`} alt="Generated Design" className="h-full w-full object-contain" />
                </div>
            </div>

            {/* 2. Compact Palette Feature */}
            {palette.length > 0 && (
                <div className="w-full max-w-md bg-white rounded-full shadow-lg border border-stone-100 p-2 px-6 flex items-center justify-between gap-4 mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Detected Palette</span>
                    <div className="flex items-center gap-2">
                        {palette.map((hex, i) => (
                            <div key={i} className="group relative">
                                <button
                                    onClick={() => copyColor(hex)}
                                    className="w-8 h-8 rounded-full border border-stone-200 shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-stone-400"
                                    style={{ backgroundColor: hex }}
                                />
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-stone-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    {hex}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. Actions & Exports */}
            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="px-6 py-2 rounded-lg border border-stone-300 text-sm font-medium hover:bg-stone-100 transition-colors flex items-center gap-2"
                >
                    <ArrowLeft size={16} /> Back to Edit
                </button>
                <button
                    onClick={downloadLookbook}
                    disabled={!lookbookBase64}
                    className="px-6 py-2 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                    <Download size={16} /> Download Presentation Board
                </button>
            </div>

            {/* Toast Notification */}
            {toastMsg && (
                <div className="fixed bottom-52 bg-stone-900 text-white text-xs px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2 z-50">
                    {toastMsg}
                </div>
            )}
        </div>
    );
}