import { useState, useMemo } from 'react';
import { LESSONS } from '../data/lessonsData';
import { ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function CharacterReviewScreen({ onExit }: { onExit: () => void }) {
  const characters = useMemo(() => {
    const charMap = new Map<string, string>();
    LESSONS.forEach(lesson => {
      lesson.questions.forEach(q => {
        if (q.targetWord && q.pinyin && !charMap.has(q.targetWord)) {
          charMap.set(q.targetWord as string, q.pinyin as string);
        }
      });
    });
    return Array.from(charMap.entries()).map(([character, pinyin]) => ({ character, pinyin }));
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPinyin, setShowPinyin] = useState(false);

  const currentCard = characters[currentIndex];

  const nextCard = () => {
    setShowPinyin(false);
    setCurrentIndex((prev) => (prev + 1) % characters.length);
  };

  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <p className="text-xl mb-4">No characters learned yet.</p>
        <button onClick={onExit} className="px-6 py-2 bg-gray-200 rounded-xl font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <header className="w-full max-w-lg flex justify-between items-center mb-8">
        <button onClick={onExit} className="p-2 hover:bg-gray-200 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Review Mode</h1>
        <div className="w-10"></div>
      </header>

      <div className="w-full max-w-md flex-grow flex flex-col justify-center gap-6">
        <div
          onClick={() => setShowPinyin(!showPinyin)}
          className="aspect-square bg-white rounded-3xl shadow-lg border-2 border-gray-100 flex flex-col items-center justify-center p-8 cursor-pointer transition-all hover:border-orange-300"
        >
          <div className="text-8xl font-bold text-gray-900 mb-6">{currentCard.character}</div>
          {showPinyin && (
            <div className="text-3xl text-orange-600 font-medium animate-in fade-in zoom-in duration-300">
              {currentCard.pinyin}
            </div>
          )}
          {!showPinyin && (
            <div className="text-sm text-gray-400">Click to reveal pinyin</div>
          )}
        </div>

        <button
          onClick={nextCard}
          className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
        >
          {currentIndex === characters.length - 1 ? <CheckCircle2 /> : <RefreshCw />}
          {currentIndex === characters.length - 1 ? 'Finish' : 'Next Card'}
        </button>
      </div>
    </div>
  );
}
