import { useState } from 'react';
import { CharacterData } from '../components/HanziCanvas';

export const useStrokeTrainer = (charData: CharacterData) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const reset = () => setIsCompleted(false);

  return {
    isCompleted,
    setIsCompleted,
    reset,
  };
};
