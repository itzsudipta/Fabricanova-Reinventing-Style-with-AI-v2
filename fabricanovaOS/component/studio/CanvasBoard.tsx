'use client';
import { useRef, useEffect, useState } from 'react';

interface CanvasBoardProps {
    onDrawEnd: (dataUrl: string) => void;
    activeTool: string;
    activeColor: string;
    activeShape: string | null;
    shapeStamp: { id: string, path: string, timestamp: number } | null;
    undoTrigger: number; // New Prop for Undo
    brushSize: number;
    opacity: number;
    importedImage?: string | null;
}

export default function CanvasBoard({
    onDrawEnd,
    activeTool,
    activeColor,
    activeShape,
    shapeStamp,
    undoTrigger,
    brushSize,
    opacity,
    importedImage
}: CanvasBoardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    // History State for Undo
    const historyStack = useRef<ImageData[]>([]);

    // State for Shape Preview
    const startPos = useRef<{ x: number, y: number } | null>(null);
    const snapshot = useRef<ImageData | null>(null);

    // Helper: Save current canvas state to history
    const saveToHistory = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        // Limit history to 20 steps to save memory
        if (historyStack.current.length > 20) {
            historyStack.current.shift();
        }
        historyStack.current.push(imageData);
    };

    // 1. Initialize Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = 800;
            canvas.height = 600;
            const context = canvas.getContext('2d', { willReadFrequently: true });
            if (context) {
                context.lineCap = 'round';
                context.lineJoin = 'round';
                context.fillStyle = 'white';
                context.fillRect(0, 0, canvas.width, canvas.height);
                setCtx(context);
                
                // Initialize history with blank white canvas
                saveToHistory(context, canvas);
                
                setTimeout(() => onDrawEnd(canvas.toDataURL()), 200);
            }
        }
    }, []);

    // 2. Handle Undo Trigger
    useEffect(() => {
        if (undoTrigger > 0 && ctx && canvasRef.current && historyStack.current.length > 1) {
            // Remove the current state (top of stack)
            historyStack.current.pop();
            // Get the previous state
            const previousState = historyStack.current[historyStack.current.length - 1];
            
            if (previousState) {
                ctx.putImageData(previousState, 0, 0);
                onDrawEnd(canvasRef.current.toDataURL());
            }
        }
    }, [undoTrigger]);

    // 3. Handle Imported Image
    useEffect(() => {
        if (importedImage && ctx && canvasRef.current) {
            const img = new Image();
            img.src = importedImage;
            img.onload = () => {
                ctx.globalAlpha = 1;
                ctx.drawImage(img, 0, 0, 800, 600);
                saveToHistory(ctx, canvasRef.current!); // Save import action
                onDrawEnd(canvasRef.current!.toDataURL());
            };
        }
    }, [importedImage, ctx]);

    // 4. Handle Fashion Shape Stamping
    useEffect(() => {
        if (shapeStamp && ctx && canvasRef.current && activeTool === 'shape') {
            const { path } = shapeStamp;
            ctx.save();
            const scale = 15;
            const centerX = canvasRef.current.width / 2;
            const centerY = canvasRef.current.height / 2;
            ctx.translate(centerX, centerY);
            ctx.scale(scale, scale);
            ctx.translate(-12, -12);
            const pathObj = new Path2D(path);
            ctx.fillStyle = activeColor;
            ctx.globalAlpha = opacity / 100;
            ctx.fill(pathObj);
            ctx.restore();
            
            saveToHistory(ctx, canvasRef.current); // Save stamp action
            onDrawEnd(canvasRef.current.toDataURL());
        }
    }, [shapeStamp]);

    // --- GEOMETRIC SHAPES HELPERS ---
    const drawHexagon = (context: CanvasRenderingContext2D, x: number, y: number, r: number) => {
        const a = 2 * Math.PI / 6;
        context.beginPath();
        for (let i = 0; i < 6; i++) {
            context.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
        }
        context.closePath();
        context.stroke();
    };

    // --- DRAWING LOGIC ---
    const startDrawing = (e: React.MouseEvent) => {
        if (!ctx || !canvasRef.current) return;

        const mouseX = e.nativeEvent.offsetX;
        const mouseY = e.nativeEvent.offsetY;

        setIsDrawing(true);
        startPos.current = { x: mouseX, y: mouseY };

        // Save snapshot for previewing shapes (prevent trails)
        snapshot.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Standard Pen/Eraser Dot
        if (activeTool === 'pen' || activeTool === 'eraser') {
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, brushSize / 2, 0, Math.PI * 2);
            ctx.fillStyle = activeTool === 'eraser' ? 'white' : activeColor;
            ctx.globalAlpha = activeTool === 'eraser' ? 1 : opacity / 100;
            ctx.fill();
        }
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing || !ctx || !startPos.current || !canvasRef.current) return;

        const currentX = e.nativeEvent.offsetX;
        const currentY = e.nativeEvent.offsetY;

        // GEOMETRIC SHAPES
        if (['line', 'rect', 'circle', 'hexagon'].includes(activeTool)) {
            if (snapshot.current) {
                ctx.putImageData(snapshot.current, 0, 0);
            }
            ctx.beginPath();
            ctx.strokeStyle = activeColor;
            ctx.lineWidth = brushSize;
            ctx.globalAlpha = opacity / 100;

            if (activeTool === 'line') {
                ctx.moveTo(startPos.current.x, startPos.current.y);
                ctx.lineTo(currentX, currentY);
                ctx.stroke();
            } else if (activeTool === 'rect') {
                ctx.strokeRect(startPos.current.x, startPos.current.y, currentX - startPos.current.x, currentY - startPos.current.y);
            } else if (activeTool === 'circle') {
                const radius = Math.sqrt(Math.pow(currentX - startPos.current.x, 2) + Math.pow(currentY - startPos.current.y, 2));
                ctx.arc(startPos.current.x, startPos.current.y, radius, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (activeTool === 'hexagon') {
                const radius = Math.sqrt(Math.pow(currentX - startPos.current.x, 2) + Math.pow(currentY - startPos.current.y, 2));
                drawHexagon(ctx, startPos.current.x, startPos.current.y, radius);
            }
        } 
        // FREEHAND DRAWING
        else if (activeTool === 'pen' || activeTool === 'eraser') {
            ctx.beginPath();
            ctx.moveTo(startPos.current.x, startPos.current.y);
            ctx.lineTo(currentX, currentY);
            
            // Fixed: Use brushSize for eraser too, allowing user control
            ctx.lineWidth = brushSize; 
            ctx.strokeStyle = activeTool === 'eraser' ? 'white' : activeColor;
            ctx.globalAlpha = activeTool === 'eraser' ? 1 : opacity / 100;
            ctx.stroke();
            
            startPos.current = { x: currentX, y: currentY };
        }
    };

    const stopDrawing = () => {
        if (!isDrawing || !canvasRef.current || !ctx) return;
        setIsDrawing(false);
        startPos.current = null;
        snapshot.current = null;
        ctx.closePath();
        
        // Save state to history after stroke completes
        saveToHistory(ctx, canvasRef.current);
        onDrawEnd(canvasRef.current.toDataURL('image/png'));
    };

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className={`bg-white shadow-2xl shadow-stone-400/20 touch-none ${activeTool === 'select' ? 'cursor-move' : 'cursor-crosshair'}`}
            style={{ width: '800px', height: '600px' }}
        />
    );
}