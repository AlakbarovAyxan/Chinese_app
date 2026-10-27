import React, { useRef, useEffect, useState } from 'react';

interface PitchVisualizerProps {
  targetTone: number; // 1-4
  onResult: (score: number) => void;
}

const PitchVisualizer: React.FC<PitchVisualizerProps> = ({ targetTone, onResult }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyzer = useRef<AnalyserNode | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Setup Web Audio API
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext.current = new AudioContext();
    const source = audioContext.current.createMediaStreamSource(stream);
    analyzer.current = audioContext.current.createAnalyser();
    source.connect(analyzer.current);
    setIsRecording(true);
    visualize();
  };

  const visualize = () => {
    if (!analyzer.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // This would contain real-time FFT frequency analysis
    // For now, we stub the visualization of a tone contour
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#58cc02'; // accent
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.quadraticCurveTo(150, 100, 300, 200); // Dummy curve
    ctx.stroke();

    if (isRecording) requestAnimationFrame(visualize);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-surface rounded-md border border-border">
      <h3 className="text-lg font-bold text-text">Say it: Tone {targetTone}</h3>
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="bg-bg rounded-md border border-border"
      />
      <button
        onClick={isRecording ? () => setIsRecording(false) : startRecording}
        className={`px-6 py-2 rounded-pill font-bold ${isRecording ? 'bg-danger text-on-accent' : 'bg-accent text-on-accent'}`}
      >
        {isRecording ? 'Stop' : 'Start Recording'}
      </button>
    </div>
  );
};

export default PitchVisualizer;
