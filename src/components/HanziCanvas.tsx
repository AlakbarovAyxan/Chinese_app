import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Point { x: number; y: number }

interface HanziCanvasProps {
  onStrokeComplete: (strokes: Point[][]) => void;
}

const HanziCanvas: React.FC<HanziCanvasProps> = ({ onStrokeComplete }) => {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const currentStroke = useRef<Point[]>([]);

  // Draw Mi Zi Ge Grid
  const drawGrid = useCallback(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#e2e8f0'; // Gray 200
    ctx.lineWidth = 2;

    // Outer boundary
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Crosshair
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Diagonals
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();
  }, []);

  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = fgCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e.nativeEvent) {
      const touchEvent = e.nativeEvent as TouchEvent;
      clientX = touchEvent.touches[0].clientX;
      clientY = touchEvent.touches[0].clientY;
    } else {
      const mouseEvent = e.nativeEvent as MouseEvent;
      clientX = mouseEvent.clientX;
      clientY = mouseEvent.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const point = getCanvasPoint(e);
    currentStroke.current = [point];

    const ctx = fgCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const point = getCanvasPoint(e);
    currentStroke.current.push(point);

    const ctx = fgCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(point.x, point.y);
    ctx.strokeStyle = '#1e293b'; // Slate 800
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    setIsDrawing(false);
    const newStrokes = [...strokes, currentStroke.current];
    setStrokes(newStrokes);
    onStrokeComplete(newStrokes);
    currentStroke.current = [];
  };

  const clearCanvas = () => {
    const canvas = fgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-[300px] h-[300px]">
        <canvas ref={bgCanvasRef} width={300} height={300} className="absolute top-0 left-0" />
        <canvas
          ref={fgCanvasRef}
          width={300}
          height={300}
          className="absolute top-0 left-0 touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <button
        onClick={clearCanvas}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Clear Canvas
      </button>
    </div>
  );
};

export default HanziCanvas;
