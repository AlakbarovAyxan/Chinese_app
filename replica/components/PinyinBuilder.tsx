import React, { useState } from 'react';

interface PinyinBuilderProps {
  initial: string;
  final: string;
  tone: number; // 1-4
  onComplete: (success: boolean) => void;
}

const TONES = ['¯', 'ˊ', 'ˇ', 'ˋ'];

const PinyinBuilder: React.FC<PinyinBuilderProps> = ({ initial, final, tone, onComplete }) => {
  const [selectedInitial, setSelectedInitial] = useState<string | null>(null);
  const [selectedFinal, setSelectedFinal] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);

  const initials = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h'];
  const finals = ['a', 'o', 'e', 'i', 'u', 'v', 'ai', 'ei', 'ui', 'ao', 'ou'];

  const handleCheck = () => {
    const isCorrect =
      selectedInitial === initial &&
      selectedFinal === final &&
      selectedTone === tone;
    onComplete(isCorrect);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-surface rounded-md border border-border">
      <h3 className="text-xl font-bold text-text">Assemble the Pinyin</h3>

      {/* Target Word Visualization */}
      <div className="flex gap-2 text-2xl font-bold p-4 bg-bg rounded-md border border-border">
        <span>{selectedInitial || '_'}</span>
        <span>{selectedFinal || '_'}</span>
        <span>{selectedTone ? TONES[selectedTone - 1] : '_'}</span>
      </div>

      {/* Initials Selection */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-text-muted">Initials:</span>
        <div className="flex flex-wrap gap-2">
          {initials.slice(0, 5).map(item => (
            <button
              key={item}
              onClick={() => setSelectedInitial(item)}
              className={`p-2 border rounded-md ${selectedInitial === item ? 'bg-accent text-on-accent' : 'bg-bg text-text'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Finals Selection */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-text-muted">Finals:</span>
        <div className="flex flex-wrap gap-2">
          {finals.slice(0, 5).map(item => (
            <button
              key={item}
              onClick={() => setSelectedFinal(item)}
              className={`p-2 border rounded-md ${selectedFinal === item ? 'bg-accent text-on-accent' : 'bg-bg text-text'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Tone Selection */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-text-muted">Tones:</span>
        <div className="flex gap-2">
          {TONES.map((t, idx) => (
            <button
              key={t}
              onClick={() => setSelectedTone(idx + 1)}
              className={`p-2 border rounded-md ${selectedTone === idx + 1 ? 'bg-accent text-on-accent' : 'bg-bg text-text'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleCheck}
        className="w-full mt-4 py-3 bg-accent text-on-accent font-bold rounded-pill"
      >
        Check
      </button>
    </div>
  );
};

export default PinyinBuilder;
