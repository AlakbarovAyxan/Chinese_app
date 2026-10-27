import type { VocabularyWord } from '../types';

// Simple HSK-level vocabulary
export const VOCABULARY_BY_HSK: Record<1 | 2 | 3 | 4 | 5 | 6, VocabularyWord[]> = {
  1: [
    { id: 'freq-1', character: '爱', pinyin: 'ài', definition: 'love', exampleSentence: '我非常爱妈妈。', hskLevel: 1 },
    { id: 'freq-2', character: '但是', pinyin: 'dàn shì', definition: 'but', exampleSentence: '我喜欢苹果，但是不喜欢香蕉。', hskLevel: 1 },
    { id: 'freq-3', character: '白天', pinyin: 'bái tiān', definition: 'day time', exampleSentence: '白天的时间过得很快。', hskLevel: 1 },
    { id: 'freq-4', character: '当然', pinyin: 'dāng rán', definition: 'of course', exampleSentence: '当然要去啊！', hskLevel: 1 },
    { id: 'freq-5', character: '的', pinyin: 'de', definition: 'possessive particle / of / \'s', exampleSentence: '这是我妈妈的书包。', hskLevel: 1 },
    { id: 'freq-6', character: '不多', pinyin: 'bù duō', definition: 'not many', exampleSentence: '我的朋友不多。', hskLevel: 1 },
    { id: 'freq-7', character: '不管', pinyin: 'bù guǎn', definition: 'regardless of', exampleSentence: '不管天气怎么样，我们都要去。', hskLevel: 1 },
    { id: 'freq-8', character: '不管', pinyin: 'bù guǎn', definition: 'regardless of', exampleSentence: '不管是什么，我都吃。', hskLevel: 1 },
    { id: 'freq-9', character: '是的', pinyin: 'shì de', definition: 'yes', exampleSentence: '这是真的。', hskLevel: 1 },
    { id: 'freq-10', character: '不知道', pinyin: 'bù zhī dào', definition: 'don\'t know', exampleSentence: '我不知道他在哪里。', hskLevel: 1 },
  ],
  2: [
    { id: 'freq-11', character: '但是', pinyin: 'dàn shì', definition: 'but', exampleSentence: '他很高，但是很瘦。', hskLevel: 2 },
    { id: 'freq-12', character: '不得不', pinyin: 'bù dé bù', definition: 'have to', exampleSentence: '我不得不去上班。', hskLevel: 2 },
    { id: 'freq-13', character: '不必', pinyin: 'bì bú', definition: 'no need', exampleSentence: '不必客气。', hskLevel: 2 },
    { id: 'freq-14', character: '不但', pinyin: 'bù dàn', definition: 'not only', exampleSentence: '他不但聪明，而且努力。', hskLevel: 2 },
  ],
  3: [],
  4: [],
  5: [],
  6: []
};

// Flattened list for easy searching
export const ALL_VOCABULARY: VocabularyWord[] = Object.values(VOCABULARY_BY_HSK).flat();

// Helper to get words by HSK level
export const getWordsByHSK = (level: 1 | 2 | 3 | 4 | 5 | 6): VocabularyWord[] => VOCABULARY_BY_HSK[level];

// Helper for searching
export const searchVocabulary = (query: string): VocabularyWord[] => {
  const q = query.toLowerCase();
  return ALL_VOCABULARY.filter(
    (word) =>
      word.character.includes(q) ||
      word.pinyin.toLowerCase().includes(q) ||
      word.definition.toLowerCase().includes(q) ||
      word.exampleSentence.includes(q)
  );
};

// Helper to get random vocabulary words
export const getRandomVocabulary = (count: number = 10): VocabularyWord[] => {
  const shuffled = [...ALL_VOCABULARY].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Helper to get words by category
export const getVocabularyByLevel = (level: 1 | 2 | 3 | 4 | 5 | 6): VocabularyWord[] => {
  return getWordsByHSK(level);
};