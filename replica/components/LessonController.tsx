import React, { useState } from 'react';
import type { Question } from '../../src/types';

interface LessonControllerProps {
  questions: Question[];
  onComplete: () => void;
}

const LessonController: React.FC<LessonControllerProps> = ({ questions, onComplete }) => {
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(5);

  const current = questions[index];

  const handleAnswer = (isCorrect: boolean) => {
    if (!isCorrect) setLives(l => Math.max(0, l - 1));
    // Simple state machine logic
    setTimeout(() => {
        if (index < questions.length - 1) {
            setIndex(i => i + 1);
        } else {
            onComplete();
        }
    }, 1000);
  };

  if (lives === 0) return <div className="text-danger font-bold p-10">Game Over</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg p-6">
      <div className="w-full max-w-lg mb-6 flex justify-between items-center text-text-muted">
        <span>Lives: {lives}</span>
        <div className="flex-1 h-2 bg-surface mx-4 rounded-pill">
            <div className="h-full bg-accent rounded-pill" style={{width: `${(index / questions.length) * 100}%`}}></div>
        </div>
      </div>
      <div className="bg-surface p-8 rounded-lg shadow-card border border-border w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{current.prompt}</h2>
        <div className="grid grid-cols-1 gap-4">
            {current.options?.map(opt => (
                <button key={opt} onClick={() => handleAnswer(opt === current.correctAnswer)} className="p-4 border border-border rounded-md hover:bg-surface text-text">
                    {opt}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LessonController;
