
'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Undo, Trash2, Save, Palette, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const colors = ['#FFFFFF', '#EF4444', '#3B82F6', '#22C55E', '#EAB308', '#A855F7'];
const brushSizes = [2, 5, 10, 20];

interface DrawingCanvasProps {
  videoId: string;
}

export function DrawingCanvas({ videoId }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState<ImageData[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  
  const getStorageKey = useCallback(() => `eduverse-drawing-${videoId}`, [videoId]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    loadDrawing();

    const handleResize = () => {
        const savedDrawing = context.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context.putImageData(savedDrawing, 0, 0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, []);

  useEffect(() => {
    if (contextRef.current) {
        contextRef.current.strokeStyle = brushColor;
        contextRef.current.lineWidth = brushSize;
    }
  }, [brushColor, brushSize]);
  
  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (canvas && contextRef.current) {
      const imageData = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);
      setHistory(prev => [...prev, imageData]);
    }
  };
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!contextRef.current) return;
    saveToHistory();
    const { offsetX, offsetY } = getCoords(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };
  
  const finishDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;
    e.preventDefault();
    const { offsetX, offsetY } = getCoords(e);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const getCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e.nativeEvent) {
        return { offsetX: e.nativeEvent.touches[0].clientX - rect.left, offsetY: e.nativeEvent.touches[0].clientY - rect.top };
    }
    return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
  }
  
  const handleUndo = () => {
    if (history.length > 0 && contextRef.current) {
      const lastState = history[history.length - 1];
      setHistory(history.slice(0, -1));
      contextRef.current.putImageData(lastState, 0, 0);
    }
  };
  
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas && contextRef.current) {
      saveToHistory();
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
  
  const saveDrawing = () => {
    try {
      const canvas = canvasRef.current;
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        localStorage.setItem(getStorageKey(), dataUrl);
        toast({
          title: "Drawing Saved!",
          description: "Your drawing has been saved in this browser.",
        });
      }
    } catch (e) {
      console.error("Failed to save drawing", e);
      toast({
        title: "Error Saving",
        description: "Could not save the drawing. Storage might be full.",
        variant: "destructive",
      });
    }
  };

  const loadDrawing = () => {
    try {
      const dataUrl = localStorage.getItem(getStorageKey());
      if (dataUrl) {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          contextRef.current?.drawImage(img, 0, 0);
        };
      }
    } catch (e) {
      console.error("Failed to load drawing", e);
    }
  };
  

  return (
    <div className="relative w-screen h-screen bg-gray-900">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        onTouchStart={startDrawing}
        onTouchEnd={finishDrawing}
        onTouchMove={draw}
        className="touch-none"
      />
      <div className="absolute top-4 left-4 flex flex-col sm:flex-row gap-2 bg-gray-800/50 p-2 rounded-lg backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/20 hover:text-white">
            <ArrowLeft />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleUndo} className="text-white hover:bg-white/20 hover:text-white">
          <Undo />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleClear} className="text-white hover:bg-white/20 hover:text-white">
          <Trash2 />
        </Button>
        <Button variant="ghost" size="icon" onClick={saveDrawing} className="text-white hover:bg-white/20 hover:text-white">
          <Save />
        </Button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        {/* Brush Size */}
        <div className="flex gap-2 bg-gray-800/50 p-2 rounded-lg backdrop-blur-sm">
            {brushSizes.map(size => (
                <button 
                    key={size}
                    onClick={() => setBrushSize(size)}
                    className={`rounded-full transition-all ${brushSize === size ? 'ring-2 ring-cyan-400' : ''}`}
                    style={{width: `${size*2}px`, height: `${size*2}px`, backgroundColor: brushColor}}
                />
            ))}
        </div>
         {/* Color Palette */}
        <div className="flex gap-2 bg-gray-800/50 p-2 rounded-lg backdrop-blur-sm">
            <Palette className="text-white"/>
            {colors.map(color => (
                <button
                key={color}
                onClick={() => setBrushColor(color)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${brushColor === color ? 'border-cyan-400 ring-2 ring-offset-2 ring-offset-gray-800 ring-cyan-400' : 'border-gray-600'}`}
                style={{ backgroundColor: color }}
                />
            ))}
        </div>
      </div>

    </div>
  );
}
