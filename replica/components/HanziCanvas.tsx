import React, { useRef, useEffect, useState } from 'react';

// Simplified stroke data structure
export interface Stroke {
  points: { x: number; y: number }[];
}

export interface CharacterData {
  id: string;
  character: string;
  strokes: Stroke[];
}

interface HanziCanvasProps {
  charData: CharacterData;
  onSuccess: () => void;
}

const HanziCanvas: React.FC<HanziCanvasProps> = ({ charData, onSuccess }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentStroke, setCurrentStroke] = useState(0);

  useEffect(() => {
    // Initial draw (outline or ghost image)
    drawGhost();
  }, [charData]);

  const drawGhost = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#e2e8f0'; // border color
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';

    charData.strokes.forEach(stroke => {
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });
  };

  const handleDraw = (e: React.MouseEvent) => {
    // Simplified validation logic:
    // In a real implementation, compare drawing path to charData.strokes[currentStroke]
    if (currentStroke < charData.strokes.length - 1) {
      setCurrentStroke(prev => prev + 1);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="bg-surface rounded-md border-2 border-border cursor-crosshair"
        onMouseDown={handleDraw}
      />
      <p className="text-text-muted">Trace the stroke: {currentStroke + 1} / {charData.strokes.length}</p>
    </div>
  );
};

export default HanziCanvas;
