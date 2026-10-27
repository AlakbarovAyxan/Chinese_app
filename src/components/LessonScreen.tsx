import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Lesson } from '../types';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import { speak } from '../utils/audio';

interface LessonScreenProps {
  lesson: Lesson;
  onExit: () => void;
  onLessonComplete?: () => void;
}

const LessonScreen: React.FC<LessonScreenProps> = ({ lesson, onExit, onLessonComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(5);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<string | null>(null);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  const currentQuestion = lesson.questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / lesson.questions.length) * 100;

  useEffect(() => {
    // Speak word when question loads
    if (currentQuestion.targetWord) {
      speak(currentQuestion.targetWord);
    }
  }, [currentQuestion]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setChecked(false);
    setAnswerCorrect(null);
    setAnswerFeedback(null);
    setLastAnswerCorrect(null);
  };

  const handleCheck = () => {
    if (!selectedOption) return;

    const correct = selectedOption === currentQuestion.correctAnswer;
    setAnswerCorrect(correct);

    if (!correct) {
      setAnswerFeedback('Incorrect! The correct answer was: ' + currentQuestion.correctAnswer);
      setLives((prev) => Math.max(0, prev - 1));

      // Heart lost message
      speak("Oh no! You lost a life.");
    } else {
      setAnswerFeedback(null);
    }

    setChecked(true);
    setLastAnswerCorrect(correct);
    if (correct && currentQuestion.targetWord) {
      speak(currentQuestion.targetWord);
    }
  };

  const handleContinue = () => {
    // Don't continue if hearts ran out
    if (lives === 0) {
      return;
    }

    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setChecked(false);
      setAnswerCorrect(null);
      setAnswerFeedback(null);
      setLastAnswerCorrect(null);
    } else {
      setIsCompleted(true);
      setAnswerFeedback(null);

      // Fire confetti celebration
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        shapes: ['circle', 'square'],
        colors: ['#58cc02', '#1cb0f6', '#ff4b4b', '#f7b500']
      });

      // Fire callback if provided
      if (onLessonComplete) {
        onLessonComplete();
      }

      speak("Lesson complete, great job!");
    }
  };

  useEffect(() => {
    if (lives === 0) {
      speak("Game over! You lost all your lives. Try again!");
    }
  }, [lives]);

  useEffect(() => {
    if (isCompleted) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#58cc02', '#1cb0f6', '#ff4b4b', '#f7b500']
      });
    }
  }, [isCompleted]);

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 text-center bg-gray-50">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5 }}
          className="text-8xl mb-6"
        >
          🎉
        </motion.div>
        <h1 className="text-4xl sm:text-5xl font-bold text-green-600 mb-3">Lesson Complete!</h1>
        <p className="text-xl sm:text-2xl text-gray-600 mb-2">Amazing job!</p>
        <p className="text-lg text-gray-500 mb-8">You've successfully completed {lesson.title}.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onExit}
            className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-[0_4px_0_0_#15803d] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#15803d] active:translate-y-[4px] active:shadow-none transition-all"
          >
            CONTINUE
          </button>
        </div>
      </div>
    );
  }

  if (lives === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-50">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5 }}
          className="text-8xl mb-6"
        >
          💔
        </motion.div>
        <h1 className="text-4xl font-bold text-duoRed mb-3">Out of Lives!</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          You've run out of lives in this lesson. Don't give up! Keep practicing, and you'll master this lesson eventually.
        </p>
        <button
          onClick={onExit}
          className="px-8 py-3 bg-duoRed text-white font-bold rounded-xl shadow-[0_4px_0_0_#ea2b2b] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#ea2b2b] active:translate-y-[4px] active:shadow-none transition-all"
        >
          TRY AGAIN
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col min-h-screen justify-between pb-32"
    >
      <header className="flex items-center justify-between p-4 max-w-4xl mx-auto w-full pt-4">
        <button onClick={onExit} className="text-gray-400 hover:text-gray-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <ProgressBar progress={progress} />
        <div className="flex items-center gap-2 font-bold text-duoRed text-xl">
          <span>❤️</span>
          <span>{lives}</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          selectedOption={selectedOption}
          onOptionClick={handleOptionSelect}
        />
        {answerFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <p className="text-duoRed font-bold text-xl text-center">{answerFeedback}</p>
          </motion.div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
        {/* Ensure bottom padding so content doesn't get cut off */}
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-5 md:px-6 pb-6 sm:pb-7 md:pb-8">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            {/* Feedback text - full width on mobile, left aligned on tablet+ */}
            <div className="flex-1 w-full min-w-0">
              {answerFeedback && (
                <p className="text-lg sm:text-xl font-bold text-center sm:text-left text-duoRed break-words">
                  {answerFeedback}
                </p>
              )}
            </div>

            {/* Check/Continue button - full width on mobile, right aligned on tablet+ */}
            <button
              onClick={checked ? handleContinue : handleCheck}
              disabled={!selectedOption || lives === 0}
              className="w-full sm:w-auto px-8 py-4 font-bold text-base sm:text-lg rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 disabled:hover:scale-100"
            >
              {currentQuestionIndex === lesson.questions.length - 1 && checked
                ? '🎉 FINISH'
                : checked
                ? '→ CONTINUE'
                : '← CHECK'}
            </button>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default LessonScreen;