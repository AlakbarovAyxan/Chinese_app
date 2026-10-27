import React, { useRef, useEffect, useState } from 'react';

interface PitchVisualizerProps {
  targetTone: number; // 1-4
  onResult: (score: number) => void;
}

interface PitchData {
  frequencies: number[];
}

// Target tone pitch curves (normalized 0-1, where 1 is highest pitch)
const getTargetToneCurve = (tone: number): number[] => {
  const points = 100;
  const curve: number[] = [];

  switch (tone) {
    case 1: // High-flat
      for (let i = 0; i < points; i++) {
        curve.push(0.85 + (0.12 * Math.sin((i / points) * Math.PI * 2)));
      }
      break;
    case 2: // Rising
      for (let i = 0; i < points; i++) {
        curve.push(0.6 + (0.35 * (i / points)));
      }
      break;
    case 3: // Rising then falling (dipping)
      for (let i = 0; i < points; i++) {
        const progress = i / points;
        let value: number;
        if (progress < 0.6) {
          value = 0.3 + (0.35 * (progress / 0.6));
        } else {
          value = 0.65 - (0.35 * ((progress - 0.6) / 0.4));
        }
        curve.push(value);
      }
      break;
    case 4: // Falling
      for (let i = 0; i < points; i++) {
        const progress = i / points;
        curve.push(0.88 - (0.85 * progress));
      }
      break;
    default:
      curve.fill(0.8, 0, points);
  }

  return curve;
};

// Convert frequency to normalized pitch (0-1 range for visualization)
const frequencyToNormalized = (freq: number): number => {
  // Map 80Hz-500Hz (typical speech range) to 0-1
  const minFreq = 80;
  const maxFreq = 500;
  return Math.max(0, Math.min(1, (freq - minFreq) / (maxFreq - minFreq)));
};

// MIDI note from frequency
const frequencyToMidi = (freq: number): number => {
  return 69 + 12 * Math.log2(freq / 440);
};

// Smooth pitch data
const smoothPitchData = (data:number[], windowSize = 5): number[] => {
  const smoothed = [...data];
  for (let i = windowSize; i < data.length - windowSize; i++) {
    let sum = 0;
    for (let j = -windowSize; j <= windowSize; j++) {
      sum += data[i + j];
    }
    smoothed[i] = sum / (2 * windowSize + 1);
  }
  return smoothed;
};

// Calculate pitch contour matching score
const calculateScore = (userPitch: number[], targetPitch: number[]): number => {
  if (userPitch.length === 0) return 0;

  let totalError = 0;
  const minLen = Math.min(userPitch.length, targetPitch.length);
  const maxLength = Math.max(userPitch.length, targetPitch.length);

  for (let i = 0; i < minLen; i++) {
    const error = Math.abs(userPitch[i] - targetPitch[i]);
    totalError += error;
  }

  for (let i = minLen; i < maxLength - 10; i++) {
    totalError += 0.2;
  }

  const avgError = totalError / Math.max(minLen, 1);
  const baseScore = 1 - Math.min(avgError, 1);
  return Math.max(0, Math.min(1, baseScore));
};

const PitchVisualizer: React.FC<PitchVisualizerProps> = ({ targetTone, onResult }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyzer = useRef<AnalyserNode | null>(null);
  const animationFrame = useRef<number | undefined>(undefined);

  const [isRecording, setIsRecording] = useState(false);
  const [currentPitch, setCurrentPitch] = useState<number | null>(null);
  const [pitchData, setPitchData] = useState<PitchData>({ frequencies: [] });

  const targetCurve = getTargetToneCurve(targetTone);

  // Setup Web Audio API
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContext.current = new AudioContextClass();
      const source = audioContext.current.createMediaStreamSource(stream);
      analyzer.current = audioContext.current.createAnalyser();

      analyzer.current.fftSize = 2048;
      analyzer.current.smoothingTimeConstant = 0.8;

      source.connect(analyzer.current);

      setIsRecording(true);
      visualize();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to use pitch visualization.');
    }
  };

  const stopRecording = () => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    setIsRecording(false);

    if (analyzer.current) {
      analyzer.current.disconnect();
      analyzer.current = null;
    }

    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }
  };

  // Autocorrelation pitch detection
  const autoCorrelate = (buffer: Float32Array, sampleRate: number): number => {
    const SIZE = buffer.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);

    if (rms < 0.01) return -1;

    const correlations = new Float32Array(SIZE);
    for (let lag = 0; lag < SIZE; lag++) {
      let correlation = 0;
      for (let i = 0; i < SIZE - lag; i++) {
        correlation += buffer[i] * buffer[i + lag];
      }
      correlations[lag] = correlation;
    }

    let firstPeak = -1;

    for (let lag = Math.floor(SIZE * 0.05); lag < SIZE * 0.5; lag++) {
      if (correlations[lag] > correlations[lag - 1] && correlations[lag] > correlations[lag + 1]) {
        if (firstPeak === -1 || correlations[lag] > correlations[firstPeak]) {
          firstPeak = lag;
        }
      }
    }

    if (firstPeak === -1) return -1;

    if (firstPeak >= 2 && firstPeak < SIZE - 2) {
      const y1 = correlations[firstPeak - 1];
      const y2 = correlations[firstPeak];
      const y3 = correlations[firstPeak + 1];
      const refinedPeak = firstPeak + (y3 - y1) / (2 * (2 * y2 - y1 - y3));
      return sampleRate / refinedPeak;
    }

    return sampleRate / firstPeak;
  };

  const visualize = () => {
    if (!analyzer.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyzer.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeDomainData = new Float32Array(bufferLength);

    analyzer.current.getByteFrequencyData(dataArray);
    analyzer.current.getFloatTimeDomainData(timeDomainData);

    const sampleRate = audioContext.current?.sampleRate || 44100;

    const pitch = autoCorrelate(timeDomainData, sampleRate);

    if (pitch > 0 && pitch < sampleRate / 2) {
      const normalizedPitch = frequencyToNormalized(pitch);

      setCurrentPitch(normalizedPitch);

      setPitchData(prev => {
        const newFrequencies = [...prev.frequencies, normalizedPitch];

        // Keep only last 5 seconds of data (assuming ~60fps, ~300 points)
        if (newFrequencies.length > 300) {
          newFrequencies.shift();
        }

        return { frequencies: newFrequencies };
      });
    }

    const currentPitchVal = pitch > 0 && pitch < sampleRate / 2
      ? frequencyToMidi(pitch) / 100
      : null;

    drawVisualization(ctx, canvas, currentPitchVal);

    if (isRecording && pitchData.frequencies.length > 50) {
      const smoothPitch = smoothPitchData(pitchData.frequencies, 5);
      const score = calculateScore(smoothPitch, targetCurve);
      setEstimatedScore(score);
    }

    if (isRecording) {
      animationFrame.current = requestAnimationFrame(visualize);
    }
  };

  const drawVisualization = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    currentPitch: number | null
  ) => {
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#2a2a4e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const targetCurvePoints = targetCurve.map((val, i) => {
      const x = (width / (targetCurve.length - 1)) * i;
      const y = height - (val * height * 0.8 + height * 0.1);
      return [x, y];
    });

    ctx.strokeStyle = targetTone === 1 ? '#ef4444' :
                      targetTone === 2 ? '#22c55e' :
                      targetTone === 3 ? '#eab308' : '#3b82f6';
    ctx.lineWidth = 4;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 10;
    ctx.beginPath();

    ctx.moveTo(targetCurvePoints[0][0], targetCurvePoints[0][1]);
    for (let i = 1; i < targetCurvePoints.length; i++) {
      ctx.lineTo(targetCurvePoints[i][0], targetCurvePoints[i][1]);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (pitchData.frequencies.length > 1) {
      const userPoints = pitchData.frequencies.map((val, i) => {
        const x = (width * (i / (pitchData.frequencies.length - 1))) + (width * 0.1);
        const y = height - (val * height * 0.8 + height * 0.1);
        return [x, y];
      });

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      if (userPoints.length > 0) {
        ctx.moveTo(userPoints[0][0], userPoints[0][1]);
        for (let i = 1; i < userPoints.length; i++) {
          ctx.lineTo(userPoints[i][0], userPoints[i][1]);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    if (currentPitch !== null) {
      const x = width / 2;
      const y = height - (currentPitch * height * 0.8 + height * 0.1);

      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = targetTone === 1 ? '#ef4444' :
                      targetTone === 2 ? '#22c55e' :
                      targetTone === 3 ? '#eab308' : '#3b82f6';
      ctx.fill();

      ctx.font = '12px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      if (currentPitch !== null) {
        const baseFreq = 220;
        const detectedFreq = baseFreq * Math.pow(2, currentPitch);
        ctx.fillText(`${detectedFreq.toFixed(1)}Hz`, x, y + 40);
      }
    }

    if (isRecording) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(width / 2, 30, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.textAlign = 'center';
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('● Recording', width / 2, 25);
    }
  };

  const [estimatedScore, setEstimatedScore] = useState<number>(0);

  useEffect(() => {
    return () => {
      // Ensure absolute cleanup
      if (audioContext.current) {
        audioContext.current.close().catch(console.error);
        audioContext.current = null;
      }
      stopRecording();
    };
  }, []);

  const handleComplete = () => {
    stopRecording();
    if (pitchData.frequencies.length > 20) {
      const smoothPitch = smoothPitchData(pitchData.frequencies, 5);
      const score = calculateScore(smoothPitch, targetCurve);
      onResult(score);
    } else {
      onResult(0);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-surface rounded-2xl shadow-card border border-border">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-text mb-2">
          Say it: Tone {targetTone} (Mandarin)
        </h3>
        <p className="text-text-muted">
          {targetTone === 1 && 'High flat - keep voice level'}
          {targetTone === 2 && 'Rising - start low, go higher'}
          {targetTone === 3 && 'Dipping - start high, dip lower, rise'}
          {targetTone === 4 && 'Falling - start high, go lower'}
        </p>
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="w-full bg-bg rounded-xl border border-border shadow-pop"
      />

      {currentPitch !== null && (
        <div className="mt-4 flex justify-center gap-8">
          <div className="text-center">
            <div className="text-sm text-text-muted mb-1">Detected Frequency</div>
            <div className="text-2xl font-bold text-accent">
              { Math.round(currentPitch * (500 - 80) + 80) } Hz
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-text-muted mb-1">MIDI Note</div>
            <div className="text-2xl font-bold text-accent">
              {Math.round(69 + 12 * Math.log2((currentPitch * (500 - 80) + 80) / 440))} MIDI
            </div>
          </div>
          {estimatedScore > 0 && (
            <div className="text-center">
              <div className="text-sm text-text-muted mb-1">Estimated Score</div>
              <div className="text-2xl font-bold">
                {Math.round(estimatedScore * 100)}%
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={isRecording ? handleComplete : startRecording}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            isRecording
              ? 'bg-danger text-on-accent hover:bg-red-600'
              : 'bg-accent text-on-accent hover:opacity-90'
          }`}
        >
          {isRecording ? 'Stop & Submit' : 'Start Recording'}
        </button>

        {pitchData.frequencies.length === 0 && !isRecording && (
          <p className="text-center text-text-muted text-sm">
            Speak clearly into your microphone to see your pitch contour
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-white rounded" />
          <span className="text-text-muted">Your Pitch</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-1 rounded ${
            targetTone === 1 ? 'bg-red-500' :
            targetTone === 2 ? 'bg-green-500' :
            targetTone === 3 ? 'bg-yellow-500' : 'bg-blue-500'
          }`} />
          <span className="text-text-muted">Target Tone</span>
        </div>
      </div>
    </div>
  );
};

export default PitchVisualizer;