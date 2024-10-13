// import { useEffect, useRef, useState } from 'react';

// export default function Home() {
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//     const [isDrawing, setIsDrawing] = useState(false);

//     useEffect(() => {
//         const canvas = canvasRef.current;

//         if (canvas) {
//             const ctx = canvas.getContext('2d');
//             if (ctx) {
//                 canvas.width = window.innerWidth;
//                 canvas.height = window.innerHeight - canvas.offsetTop;
//                 ctx.lineCap = 'round';
//                 ctx.lineWidth = 3;
//             }
//         }

//         // Handle window resize to adjust canvas size
//         const handleResize = () => {
//             const canvas = canvasRef.current;
//             if (canvas) {
//                 const ctx = canvas.getContext('2d');
//                 if (ctx) {
//                     canvas.width = window.innerWidth;
//                     canvas.height = window.innerHeight - canvas.offsetTop;
//                 }
//             }
//         };

//         window.addEventListener('resize', handleResize);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//             canvas.style.background = 'black';
//             const ctx = canvas.getContext('2d');
//             if (ctx) {
//                 ctx.beginPath();
//                 ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//                 setIsDrawing(true);
//             }
//         }
//     };

//     const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
//         if (!isDrawing) {
//             return;
//         }
//         const canvas = canvasRef.current;
//         if (canvas) {
//             const ctx = canvas.getContext('2d');
//             if (ctx) {
//                 ctx.strokeStyle = 'white';
//                 ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//                 ctx.stroke();
//             }
//         }
//     };

//     const stopDrawing = () => {
//         setIsDrawing(false);
//     };

//     return (
//         <>
//             <canvas
//             ref={canvasRef}
//             className="absolute top-0 left-0 w-full h-full"
//             onMouseDown={startDrawing}
//             onMouseMove={draw}
//             onMouseUp={stopDrawing}
//             onMouseLeave={stopDrawing}
//             />
//         </>
//     );
// }



import React, { useState, useRef, useEffect } from 'react';
import { Eraser, RotateCcw, Download, Trash2 } from 'lucide-react';

const DrawingApp: React.FC = () => {
  const [color, setColor] = useState<string>("#FFFFFF");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [brushSize, setBrushSize] = useState<number>(5);
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);

  const colors = ['#FFFFFF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA', '#F0B67F', '#FE4A49', '#A3F7BF', '#29A19C'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 70; // Adjust for toolbar height
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = "#1E1E1E";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctxRef.current = ctx;
        saveToUndoStack();
      }
    }

    const handleResize = () => {
      if (canvas && ctxRef.current) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCanvas.getContext('2d')?.drawImage(canvas, 0, 0);
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 70;
        
        ctxRef.current.drawImage(tempCanvas, 0, 0);
        ctxRef.current.lineCap = 'round';
        ctxRef.current.lineJoin = 'round';
        ctxRef.current.lineWidth = brushSize;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.lineWidth = brushSize;
    }
  }, [brushSize]);

  const startDrawing = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const ctx = ctxRef.current;
    if (ctx) {
      setIsDrawing(true);
      ctx.beginPath();
      const { offsetX, offsetY } = e.nativeEvent;
      ctx.moveTo(offsetX, offsetY);
      setMousePosition({ x: offsetX, y: offsetY });
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    if (ctx) {
      const { offsetX, offsetY } = e.nativeEvent;
      ctx.lineTo(offsetX, offsetY);
      ctx.strokeStyle = color;
      ctx.stroke();
      setMousePosition({ x: offsetX, y: offsetY });
    }
  };

  const stopDrawing = () => {
    if (ctxRef.current) {
      setIsDrawing(false);
      ctxRef.current.closePath();
      saveToUndoStack();
    }
  };

  const handleColorChange = (selectedColor: string) => {
    setColor(selectedColor);
  };

  const handleEraser = () => {
    setColor('#1E1E1E');
  };

  <h1 className="text-white text-2xl font-bold">"Raghav Canvas"</h1>

  const handleBrushSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushSize(parseInt(e.target.value, 10));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) {
      const { offsetX, offsetY } = e.nativeEvent;
      setMousePosition({ x: offsetX, y: offsetY });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
    stopDrawing();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'drawing.png';
      link.href = dataURL;
      link.click();
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      ctx.fillStyle = "#1E1E1E";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveToUndoStack();
    }
  };

  const saveToUndoStack = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setUndoStack(prevStack => [...prevStack, imageData]);
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 1) {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (canvas && ctx) {
        setUndoStack(prevStack => {
          const newStack = [...prevStack];
          newStack.pop(); // Remove the current state
          const previousState = newStack[newStack.length - 1];
          ctx.putImageData(previousState, 0, 0);
          return newStack;
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-gray-800 h-[70px] shadow-lg">
        <div className="flex items-center gap-4">
          {colors.map((c) => (
            <button
              key={c}
              className={`w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110 ${
                c === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''
              }`}
              style={{ backgroundColor: c }}
              onClick={() => handleColorChange(c)}
            />
          ))}
          <button
            className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
            onClick={handleEraser}
            title="Eraser"
          >
            <Eraser className="text-white" size={24} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={handleBrushSizeChange}
            className="w-32 accent-teal-500"
            title={`Brush Size: ${brushSize}`}
          />
          <button
            className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
            onClick={handleUndo}
            title="Undo"
          >
            <RotateCcw className="text-white" size={24} />
          </button>
          <button
            className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
            onClick={handleSave}
            title="Save"
          >
            <Download className="text-white" size={24} />
          </button>
          <button
            className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors"
            onClick={handleClear}
            title="Clear Canvas"
          >
            <Trash2 className="text-white" size={24} />
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={(e) => {
          handleMouseMove(e);
          draw(e);
        }}
        onMouseUp={stopDrawing}
        onMouseLeave={handleMouseLeave}
        className="flex-1 cursor-crosshair"
      />

      {mousePosition && (
        <div
          className="absolute rounded-full pointer-events-none transition-all duration-300"
          style={{
            width: `${brushSize}px`,
            height: `${brushSize}px`,
            left: mousePosition.x,
            top: mousePosition.y,
            transform: 'translate(-50%, -50%)',
            backgroundColor: color === '#1E1E1E' ? 'rgba(255, 255, 255, 0.7)' : color,
          }}
        />
      )}
    </div>
  );
};

export default DrawingApp;