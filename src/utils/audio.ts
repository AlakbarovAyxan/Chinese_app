export const speak = (text: string, lang: string = 'zh-CN') => {
  if (!window.speechSynthesis) return;

  // Stop ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
};

export const stop = () => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
};
