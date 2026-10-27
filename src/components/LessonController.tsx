import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import HanziCanvas from './HanziCanvas';
import PinyinBuilder from './PinyinBuilder';
import PitchVisualizer from './PitchVisualizer';
import type { Lesson } from '../types';

interface LessonControllerProps {
  lesson: Lesson;
  userId: string;
  onExit: () => void;
  onComplete?: (result: LessonResult) => void;
}

export interface LessonStep {
  id: string;
  type: 'hanzi' | 'pinyin' | 'pitch';
  name: string;
  description?: string;
}

export interface LessonStepAttempt {
  step: LessonStep;
  score: number;
  correctAttempts: number;
  totalAttempts: number;
  timeSpent: number;
  completedAt: number;
}

export interface LessonResult {
  lessonId: string;
  lessonTitle: string;
  completedAt: number;
  totalTime: number;
  steps: LessonStepAttempt[];
  overallScore: number;
}

const LessonController: React.FC<LessonControllerProps> = ({
  lesson,
  userId,
  onExit,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepAttempts, setStepAttempts] = useState<LessonStepAttempt[]>([]);
  const [startTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCurrentStep = (): LessonStep => {
    if (currentStepIndex < lesson.questions.length) {
      const question = lesson.questions[currentStepIndex];
      if (question.type === 'hanzi-exercise' || question.type === 'character') {
        return {
          id: question.id,
          type: 'hanzi',
          name: question.type === 'hanzi-exercise' ? 'Write Character' : 'Write Character',
          description: question.pinyin ? `Target: ${question.pinyin}` : undefined,
        };
      } else if (question.type === 'pinyin' || question.type === 'sound-practice') {
        return {
          id: question.id,
          type: 'pinyin',
          name: question.type === 'pinyin' ? 'Build Pinyin' : 'Build Pinyin',
          description: question.pinyin ? `Try to build: ${question.pinyin}` : undefined,
        };
      } else {
        return {
          id: question.id,
          type: 'pitch',
          name: 'Practice Tone',
          description: question.pinyin ? `Try: ${question.pinyin}` : undefined,
        };
      }
    }
    return { id: 'final', type: 'pitch', name: 'Final Practice' };
  };

  const getStepColor = (type: string): string => {
    return type === 'hanzi' ? '#e11d48' :
           type === 'pinyin' ? '#3b82f6' : '#8b5cf6';
  };

  const handleHanxiComplete = async (strokes: any[]) => {
    // Mock scoring - in production, compare with target strokes
    const score = 0.7 + (Math.random() * 0.2); // 70-90% for demo
    const correct = Math.floor(score * 2) + 1; // 1-2 correct attempts
    const totalTime = Date.now() - startTime;

    const step = getCurrentStep();

    const attempt: LessonStepAttempt = {
      step,
      score,
      correctAttempts: correct,
      totalAttempts: strokes.length, // Simplified
      timeSpent: totalTime,
      completedAt: Date.now(),
    };

    setStepAttempts([...stepAttempts, attempt]);
    setCurrentStepIndex(currentStepIndex + 1);
  };

  const handlePinyinComplete = async (syllable: string) => {
    const question = lesson.questions[currentStepIndex];
    const target = question.targetWord || question.pinyin || '';

    // Calculate score based on match
    const score = target.toLowerCase().includes(syllable.toLowerCase()) ? 0.9 : 0.5;
    const totalAttempts = syllable.length > 0 ? syllable.length : 1;
    const correctAttempts = target.toLowerCase().includes(syllable.toLowerCase()) ? totalAttempts : 0;
    const totalTime = Date.now() - startTime;

    const step = getCurrentStep();

    const attempt: LessonStepAttempt = {
      step,
      score,
      correctAttempts,
      totalAttempts,
      timeSpent: totalTime,
      completedAt: Date.now(),
    };

    setStepAttempts([...stepAttempts, attempt]);
    setCurrentStepIndex(currentStepIndex + 1);
  };

  const handlePitchComplete = async (score: number) => {
    const totalTime = Date.now() - startTime;

    const step = getCurrentStep();

    // If this is the final "pitch" step after all questions, complete the lesson
    const isFinalStep = currentStepIndex >= stepAttempts.length;
    let attempt: LessonStepAttempt;

    if (isFinalStep && currentStepIndex === lesson.questions.length) {
      attempt = {
        step: { id: 'pitch-practice', type: 'pitch', name: 'Pitch Practice' },
        score: score * 0.8, // Final pitch is 80% weight
        correctAttempts: score >= 0.7 ? 1 : 0,
        totalAttempts: 1,
        timeSpent: totalTime,
        completedAt: Date.now(),
      };
    } else {
      attempt = {
        step,
        score: score * 0.5, // Pitch practice weights
        correctAttempts: score >= 0.7 ? 1 : 0,
        totalAttempts: 1,
        timeSpent: totalTime,
        completedAt: Date.now(),
      };
    }

    setStepAttempts([...stepAttempts, attempt]);

    if (isFinalStep) {
      completeLesson();
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const completeLesson = async () => {
    setIsSubmitting(true);
    const totalTime = Date.now() - startTime;

    // Calculate overall score
    const totalSteps = stepAttempts.length;
    const weightedScore = stepAttempts.reduce((sum, attempt) => {
      // Weights: Hanzi 0.4, Pinyin 0.3, Pitch 0.3
      const weight = attempt.step.type === 'hanzi' ? 0.4 :
                     attempt.step.type === 'pinyin' ? 0.3 : 0.3;
      return sum + (attempt.score * weight);
    }, 0);

    const overallScore = weightedScore / totalSteps;

    const result: LessonResult = {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      completedAt: Date.now(),
      totalTime,
      steps: stepAttempts,
      overallScore,
    };

    // Save to Supabase
    try {
      const { error } = await supabase
        .from('lesson_progress')
        .insert({
          user_id: userId,
          lesson_id: lesson.id,
          overall_score: overallScore,
          total_attempts: totalSteps,
          duration: totalTime,
          completed_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving lesson progress:', error);
        // Still proceed even if DB save fails
        if (onComplete) {
          onComplete(result);
        }
        setIsSubmitting(false);
      } else {
        if (onComplete) {
          onComplete(result);
        }
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      if (onComplete) {
        onComplete(result);
      }
      setIsSubmitting(false);
    }
  };

  const currentStep = getCurrentStep();
  const progress = ((currentStepIndex) / (lesson.questions.length - 1)) * 100 || 0;
  const totalQuestions = lesson.questions.length || 1;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-text-muted hover:text-text transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Exit Lesson</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-text">{lesson.title}</h2>
          <span className="text-text-muted">
            {currentStepIndex + 1} / {totalQuestions}
          </span>
        </div>
        <div className="h-3 bg-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="mb-8 flex justify-between">
        {lesson.questions.map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                index < currentStepIndex
                  ? `bg-success text-white`
                  : index === currentStepIndex
                  ? 'bg-accent text-on-accent'
                  : 'bg-bg text-text-muted'
              }`}
            >
              <span className={index < currentStepIndex ? 'hidden' : 'block'}>
                {index + 1}
              </span>
              <span className={index >= currentStepIndex ? 'block' : 'hidden'}>
                ✓
              </span>
            </div>
            <div className={`text-xs text-center ${index < currentStepIndex ? 'text-success' : 'text-text-muted'}`}>
              Step {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="bg-surface rounded-2xl shadow-card border border-border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: getStepColor(currentStep.type) }}
          >
            {currentStep.type === 'hanzi' ? '✍️' : currentStep.type === 'pinyin' ? '🗣️' : '🎤'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-text">{currentStep.name}</h3>
            {currentStep.description && (
              <p className="text-sm text-text-muted">{currentStep.description}</p>
            )}
          </div>
        </div>

        {/* Step Content */}
        {currentStep.type === 'hanzi' && (
          <HanziCanvas onStrokeComplete={handleHanxiComplete} />
        )}

        {currentStep.type === 'pinyin' && (
          <PinyinBuilder onComplete={handlePinyinComplete} />
        )}

        {currentStep.type === 'pitch' && (
          <PitchVisualizer
            targetTone={currentStepIndex % 4 + 1}
            onResult={handlePitchComplete}
          />
        )}
      </div>

      {/* Time Tracker */}
      {!isSubmitting && stepAttempts.length > 0 && (
        <div className="text-center text-sm text-text-muted">
          Time spent on this step: {Math.floor((Date.now() - startTime) / 1000)}s
        </div>
      )}

      {/* Submitting State */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-bg/80 flex items-center justify-center">
          <div className="bg-surface rounded-2xl p-8 shadow-card border border-border text-center">
            <div className="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-lg font-bold text-text">Saving your progress...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonController;