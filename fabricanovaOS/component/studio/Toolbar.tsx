'use client';
import { PenTool, MousePointer2, Image as ImageIcon, Type, Eraser, Grid } from 'lucide-react';

export default function Toolbar({ activeTool, setActiveTool }: { activeTool: string, setActiveTool: (t: string) => void }) {
    const tools = [
        { id: 'select', icon: MousePointer2 },
        { id: 'pen', icon: PenTool },
        { id: 'shape', icon: ImageIcon },
        { id: 'text', icon: Type },
        { id: 'eraser', icon: Eraser },
    ];

    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white px-2 py-2 rounded-lg shadow-lg shadow-stone-900/5 border border-stone-200 flex items-center gap-1 z-20">
            {tools.map((tool) => (
                <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`p-2 rounded transition-colors ${activeTool === tool.id ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'}`}
                >
                    <tool.icon size={18} />
                </button>
            ))}
        </div>
    );
}