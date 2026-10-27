import React, { useState } from 'react';

interface SentenceConstructionProps {
  sentence: string[]; // Correct order of words/characters
  onComplete: (isCorrect: boolean) => void;
}

const SentenceConstruction: React.FC<SentenceConstructionProps> = ({ sentence, onComplete }) => {
  const [shuffled] = useState(() => [...sentence].sort(() => Math.random() - 0.5));
  const [userSentence, setUserSentence] = useState<string[]>([]);

  const handleWordClick = (word: string) => {
    setUserSentence([...userSentence, word]);
    // Optionally remove from shuffled list, for now just add to sentence
  };

  const checkAnswer = () => {
    const isCorrect = userSentence.join('') === sentence.join('');
    onComplete(isCorrect);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
      <h3 className="text-xl font-bold mb-6">Arrange the sentence:</h3>
      <div className="flex justify-center gap-2 mb-8 min-h-[4rem] p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        {userSentence.map((word, i) => (
          <span key={i} className="text-2xl font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-lg">{word}</span>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {shuffled.map((word, i) => (
          <button
            key={i}
            onClick={() => handleWordClick(word)}
            className="text-xl font-bold bg-white border-2 border-gray-200 px-4 py-2 rounded-xl hover:border-blue-400 transition"
          >
            {word}
          </button>
        ))}
      </div>
      <button
        onClick={checkAnswer}
        className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
      >
        Check
      </button>
    </div>
  );
};

export default SentenceConstruction;
