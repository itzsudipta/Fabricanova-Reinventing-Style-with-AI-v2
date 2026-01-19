'use client';
import { PenTool, MousePointer2, Image as ImageIcon, Type, Eraser, Grid } from 'lucide-react';

export default function Toolbar({ activeTool, setActiveTool }: { activeTool: string, setActiveTool: (t: string) => void }) {
    const tools = [
        { id: 'select', icon: MousePointer2 },
        { id: 'pen', icon: PenTool },
        { id: 'shape', icon: ImageIcon },
        { id: 'text', icon: Type },
        { id: 'eraser', icon: Eraser },
        // Added Grid mostly for visual consistency with your request
        { id: 'grid', icon: Grid }, 
    ];

    return (
        <div className="flex items-center gap-1">
            {tools.map((tool) => (
                <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                        activeTool === tool.id 
                        ? 'bg-stone-900 text-white shadow-sm scale-105' 
                        : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                    title={tool.id.charAt(0).toUpperCase() + tool.id.slice(1)}
                >
                    <tool.icon size={18} strokeWidth={2} />
                </button>
            ))}
        </div>
    );
}