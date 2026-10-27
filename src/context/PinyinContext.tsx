import React, { createContext, useContext, useState, useEffect } from 'react';

interface PinyinContextType {
  showPinyin: boolean;
  togglePinyin: () => void;
}

const PinyinContext = createContext<PinyinContextType | undefined>(undefined);

export const PinyinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showPinyin, setShowPinyin] = useState(() => {
    const saved = localStorage.getItem('showPinyin');
    try {
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    localStorage.setItem('showPinyin', JSON.stringify(showPinyin));
  }, [showPinyin]);

  const togglePinyin = () => setShowPinyin((prev: boolean) => !prev);

  return (
    <PinyinContext.Provider value={{ showPinyin, togglePinyin }}>
      {children}
    </PinyinContext.Provider>
  );
};

export const usePinyin = () => {
  const context = useContext(PinyinContext);
  if (context === undefined) {
    throw new Error('usePinyin must be used within a PinyinProvider');
  }
  return context;
};
