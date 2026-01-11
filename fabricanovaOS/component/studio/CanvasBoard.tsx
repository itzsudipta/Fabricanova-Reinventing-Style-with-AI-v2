'use client';
import { useRef, useEffect, useState } from 'react';

interface CanvasBoardProps {
    onDrawEnd: (dataUrl: string) => void;
    activeTool: string;
    brushSize: number;
    opacity: number;
    importedImage?: string | null;
}

export default function CanvasBoard({
    onDrawEnd,
    activeTool,
    brushSize,
    opacity,
    importedImage
}: CanvasBoardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    // Store the last position to create smooth segments
    const lastPos = useRef<{ x: number, y: number } | null>(null);

    // 1. Initialize Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = 800;
            canvas.height = 600;
            const context = canvas.getContext('2d');
            if (context) {
                context.lineCap = 'round';
                context.lineJoin = 'round';
                context.fillStyle = 'white';
                context.fillRect(0, 0, canvas.width, canvas.height);
                setCtx(context);

                // Auto-save blank canvas on load
                setTimeout(() => {
                    const initialData = canvas.toDataURL('image/png');
                    onDrawEnd(initialData);
                }, 200);
            }
        }
    }, []);

    // 2. Handle Imported Image
    useEffect(() => {
        if (importedImage && ctx && canvasRef.current) {
            const img = new Image();
            img.src = importedImage;
            img.onload = () => {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, 800, 600);
                ctx.drawImage(img, 0, 0, 800, 600);
                const dataUrl = canvasRef.current!.toDataURL('image/png');
                onDrawEnd(dataUrl);
            };
        }
    }, [importedImage, ctx]);

    // 3. Drawing Logic (FIXED PHYSICS)
    const startDrawing = (e: React.MouseEvent) => {
        if (!ctx) return;
        setIsDrawing(true);
        // Start a new path segment
        lastPos.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };

        // Draw a single dot in case the user just clicks
        ctx.beginPath();
        ctx.arc(lastPos.current.x, lastPos.current.y, brushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = activeTool === 'eraser' ? 'white' : 'black';
        ctx.fill();
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing || !ctx || !lastPos.current) return;

        const currentX = e.nativeEvent.offsetX;
        const currentY = e.nativeEvent.offsetY;

        ctx.beginPath(); // Start fresh path for this segment
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(currentX, currentY);

        // Apply Properties dynamically
        ctx.lineWidth = activeTool === 'eraser' ? 20 : brushSize;
        ctx.strokeStyle = activeTool === 'eraser' ? 'white' : 'black';
        ctx.globalAlpha = activeTool === 'eraser' ? 1 : opacity / 100;

        ctx.stroke();

        // Update last position
        lastPos.current = { x: currentX, y: currentY };
    };

    const stopDrawing = () => {
        if (!isDrawing || !canvasRef.current) return;
        setIsDrawing(false);
        lastPos.current = null;
        ctx?.closePath();

        const dataUrl = canvasRef.current.toDataURL('image/png');
        onDrawEnd(dataUrl);
    };

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="bg-white shadow-2xl shadow-stone-400/20 cursor-crosshair touch-none"
            style={{ width: '800px', height: '600px' }}
        />
    );
}