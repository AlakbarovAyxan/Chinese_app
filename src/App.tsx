import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LESSONS } from './data/lessonsData';
import LessonScreen from './components/LessonScreen';
import CharacterReviewScreen from './components/CharacterReviewScreen';
import PathView from './components/PathView';
import HanziCanvas from './components/HanziCanvas';
import PitchVisualizer from './components/PitchVisualizer';
import PinyinBuilder from './components/PinyinBuilder';
import Header from './components/Header';
import type { Lesson } from './types';
import { usePinyin } from './context/PinyinContext';

function App() {
  const [activeView, setActiveView] = useState<'home' | 'path' | 'hanzi' | 'pitch' | 'pinyin' | 'lesson' | 'review' | 'practice'>('home');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [selectedStep, setSelectedStep] = useState<'hanzi' | 'pinyin' | 'pitch' | null>(null);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const { showPinyin, togglePinyin } = usePinyin();

  useEffect(() => {
    const savedStreak = localStorage.getItem('streak');
    const savedXp = localStorage.getItem('xp');
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
    if (savedXp) setXp(parseInt(savedXp, 10));
  }, []);

  const handleLessonComplete = () => {
    const newStreak = streak + 1;
    const newXp = xp + 10;
    setStreak(newStreak);
    setXp(newXp);
    localStorage.setItem('streak', newStreak.toString());
    localStorage.setItem('xp', newXp.toString());
    setActiveView('home');
    setActiveLesson(null);
  };

  const handlePracticeComplete = () => {
    setSelectedStep(null);
    setActiveView('home');
  };

  const renderView = () => {
    switch (activeView) {
      case 'path': return <PathView onNodeClick={(node) => {
        const lesson = LESSONS.find(l => l.title === node.title);
        if (lesson && node.status !== 'locked') {
          setActiveLesson(lesson);
          setActiveView('lesson');
        } else {
          alert('This lesson is locked or not available!');
        }
      }} />;
      case 'hanzi': return <HanziCanvas onStrokeComplete={(strokes) => console.log('Strokes updated:', strokes)} />;
      case 'pitch': return <PitchVisualizer targetTone={1} onResult={() => alert('Score!')} />;
      case 'pinyin': return <PinyinBuilder onComplete={(syllable) => console.log('Completed:', syllable)} />;
      case 'lesson': return activeLesson ? <LessonScreen lesson={activeLesson} onExit={handleLessonComplete} onLessonComplete={handleLessonComplete} /> : null;
      case 'practice':
        if (!selectedStep) return <div className="p-6 text-center">Select a practice type</div>;

        return (
          <div className="w-full max-w-4xl mx-auto p-6">
            <button onClick={handlePracticeComplete} className="mb-6 text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Home
            </button>
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              {selectedStep === 'hanzi' && (
                <HanziCanvas onStrokeComplete={(strokes) => {
                  alert(`Step complete! Strokes: ${strokes.length}`);
                  setSelectedStep(null);
                }} />
              )}
              {selectedStep === 'pinyin' && (
                <PinyinBuilder onComplete={(syllable) => {
                  alert(`Pinyin created: ${syllable}`);
                  setSelectedStep(null);
                }} />
              )}
              {selectedStep === 'pitch' && (
                <PitchVisualizer
                  targetTone={1}
                  onResult={(score) => {
                    alert(`Pitch score: ${Math.round(score * 100)}%`);
                    setSelectedStep(null);
                  }}
                />
              )}
            </div>
          </div>
        );
      case 'review': return <CharacterReviewScreen onExit={() => setActiveView('home')} />;
      default:
        return (
          <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Your Journey</h2>
                <button onClick={togglePinyin} className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-300">
                    Pinyin: {showPinyin ? 'On' : 'Off'}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LESSONS.map((lesson, index) => (
                <motion.button
                  key={lesson.id}
                  onClick={() => { setActiveLesson(lesson); setActiveView('lesson'); }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 300
                  }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 text-left group"
                >
                  <div className="text-5xl mb-6">{lesson.icon}</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{lesson.title}</h2>
                  <p className="text-gray-600 flex-grow">{lesson.description}</p>
                </motion.button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header streak={streak} xp={xp} onNavigate={setActiveView} />
      <main className="py-8">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
