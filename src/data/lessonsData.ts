import type { Lesson } from '../types';
import { VOCABULARY_BY_HSK } from './vocabularyData';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Greetings',
    description: 'Learn basic Chinese greetings',
    icon: '👋',
    vocabulary: [VOCABULARY_BY_HSK[1][0], VOCABULARY_BY_HSK[1][1]],
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        prompt: 'How do you say "Hello" in Chinese?',
        targetWord: '你好',
        pinyin: 'Nǐ hǎo',
        options: ['你好', '谢谢', '再见', '不好'],
        correctAnswer: '你好',
        vocabularyId: 'hsk1-1',
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        prompt: 'What does "谢谢" (Xièxiè) mean?',
        targetWord: '谢谢',
        pinyin: 'Xièxiè',
        options: ['Hello', 'Thank you', 'Goodbye', 'Sorry'],
        correctAnswer: 'Thank you',
        vocabularyId: 'hsk1-2',
      },
    ],
  },
  {
    id: 'lesson-2',
    title: 'Numbers 1-10',
    description: 'Learn to count in Chinese',
    icon: '🔢',
    vocabulary: [],
    questions: [
      {
        id: 'q3',
        type: 'multiple-choice',
        prompt: 'What is "One" in Chinese?',
        targetWord: '一',
        pinyin: 'Yī',
        options: ['一', '二', '三', '四'],
        correctAnswer: '一',
      },
    ],
  },
  {
    id: 'lesson-3',
    title: 'Food & Drinks',
    description: 'Learn common food items',
    icon: '🍎',
    vocabulary: [],
    questions: [
      {
        id: 'q4',
        type: 'multiple-choice',
        prompt: 'What is "Apple" in Chinese?',
        targetWord: '苹果',
        pinyin: 'Píngguǒ',
        options: ['苹果', '水', '米饭', '面条'],
        correctAnswer: '苹果',
      },
    ],
  },
  {
    id: 'lesson-4',
    title: 'Family Members',
    description: 'Learn family names',
    icon: '👨‍👩‍👧',
    vocabulary: [],
    questions: [
      {
        id: 'q5',
        type: 'multiple-choice',
        prompt: 'What is "Mother" in Chinese?',
        targetWord: '妈妈',
        pinyin: 'Māma',
        options: ['妈妈', '爸爸', '哥哥', '姐姐'],
        correctAnswer: '妈妈',
      },
    ],
  },
  {
    id: 'lesson-5',
    title: 'Colors',
    description: 'Learn basic colors',
    icon: '🎨',
    vocabulary: [],
    questions: [
      {
        id: 'q6',
        type: 'multiple-choice',
        prompt: 'What is "Red" in Chinese?',
        targetWord: '红色',
        pinyin: 'Hóngsè',
        options: ['红色', '蓝色', '绿色', '黄色'],
        correctAnswer: '红色',
      },
    ],
  },
];
