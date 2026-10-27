import React, { useState, useMemo } from 'react';

interface PinyinBuilderProps {
  onComplete: (syllable: string) => void;
}

const INITIALS = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'];
const FINALS = ['a', 'o', 'e', 'i', 'u', 'ü', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'ia', 'ie', 'iao', 'iu', 'ian', 'in', 'iang', 'ing', 'iong', 'ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang', 'ueng', 'üe', 'üan', 'ün'];
const TONES = ['', 'ˉ', 'ˊ', 'ˇ', 'ˋ']; // Neutral tone is index 0

const toneMap: { [key: string]: { [key: number]: string } } = {
  'a': { 1: 'ā', 2: 'á', 3: 'ǎ', 4: 'à' },
  'o': { 1: 'ō', 2: 'ó', 3: 'ǒ', 4: 'ò' },
  'e': { 1: 'ē', 2: 'é', 3: 'ě', 4: 'è' },
  'i': { 1: 'ī', 2: 'í', 3: 'ǐ', 4: 'ì' },
  'u': { 1: 'ū', 2: 'ú', 3: 'ǔ', 4: 'ù' },
  'ü': { 1: 'ǖ', 2: 'ǘ', 3: 'ǚ', 4: 'ǜ' },
};

function getPinyinWithTone(initial: string, final: string, tone: number): string {
  if (tone === 0) return initial + final;

  // Rule: a > o > e > i > u > ü
  const vowels = ['a', 'o', 'e', 'i', 'u', 'ü'];
  let targetVowel = '';

  for (const v of vowels) {
    if (final.includes(v)) {
      targetVowel = v;
      break;
    }
  }

  // Special rule: if 'i' and 'u' are both present, tone mark goes on the second one (e.g., 'ui', 'iu')
  if (final.includes('i') && final.includes('u')) {
    targetVowel = final.indexOf('u') > final.indexOf('i') ? 'u' : 'i';
  }

  // Handle compound finals like 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', etc.
  // For these, the tone mark should go on the first vowel in priority order
  if (targetVowel === 'i' && final.includes('a')) targetVowel = 'a';
  if (targetVowel === 'i' && final.includes('o')) targetVowel = 'o';
  if (targetVowel === 'i' && final.includes('e')) targetVowel = 'e';
  if (targetVowel === 'u' && final.includes('a')) targetVowel = 'a';
  if (targetVowel === 'u' && final.includes('o')) targetVowel = 'o';
  if (targetVowel === 'u' && final.includes('e')) targetVowel = 'e';
  if (targetVowel === 'ü' && final.includes('e')) targetVowel = 'e'; // üe -> tone on e

  const markedVowel = toneMap[targetVowel]?.[tone] || targetVowel;
  return initial + final.replace(targetVowel, markedVowel);
}

const PinyinBuilder: React.FC<PinyinBuilderProps> = ({ onComplete }) => {
  const [initial, setInitial] = useState('');
  const [final, setFinal] = useState('');
  const [tone, setTone] = useState(0);

  const pinyin = useMemo(() => {
    if (!initial || !final) return '';
    return getPinyinWithTone(initial, final, tone);
  }, [initial, final, tone]);

  const handleComplete = () => {
    if (pinyin) {
      onComplete(pinyin);
      // Visual feedback: simple alert for now
      alert(`Syllable formed: ${pinyin}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800">Construct Pinyin</h3>

      <div className={`text-5xl font-bold p-6 rounded-xl border-2 transition-colors ${pinyin ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
        {pinyin || '...'}
      </div>

      <div className="w-full space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-500 mb-2">Initials</h4>
          <div className="flex flex-wrap gap-2">
            {INITIALS.map(i => (
              <button key={i} onClick={() => setInitial(i)} className={`px-3 py-1 rounded-lg border ${initial === i ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}>{i}</button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-500 mb-2">Finals</h4>
          <div className="flex flex-wrap gap-2">
            {FINALS.map(f => (
              <button key={f} onClick={() => setFinal(f)} className={`px-3 py-1 rounded-lg border ${final === f ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}>{f}</button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-500 mb-2">Tones</h4>
          <div className="flex gap-2">
            {TONES.map((t, idx) => (
              <button key={idx} onClick={() => setTone(idx)} className={`px-4 py-2 rounded-lg border ${tone === idx ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'}`}>{t || 'Neutral'}</button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleComplete} disabled={!pinyin} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition">
        Done
      </button>
    </div>
  );
};

export default PinyinBuilder;
