export type QuestionType = 'multiple-choice' | 'matching' | 'order' | 'hanzi-exercise' | 'character' | 'pinyin' | 'sound-practice' | 'sentence-construction';

export interface VocabularyWord {
  id: string;
  character: string;
  pinyin: string;
  definition: string;
  exampleSentence: string;
  hskLevel: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  targetWord?: string;
  options?: string[];
  correctAnswer: string | string[];
  pinyin?: string;
  vocabularyId?: string; // Reference to VocabularyWord
}

export interface LessonResult {
  overallScore: number;
  steps: { score: number }[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
  vocabulary?: VocabularyWord[]; // Embedded vocabulary
}

