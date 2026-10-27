import React from 'react';

interface HeaderProps {
  streak: number;
  xp: number;
  onNavigate: (view: 'home' | 'path' | 'hanzi' | 'pitch' | 'pinyin' | 'lesson' | 'review' | 'practice') => void;
}

const Header: React.FC<HeaderProps> = ({ streak, xp, onNavigate }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 p-4 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Mandarin Master
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full font-bold">
            🔥 <span>{streak}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold">
            ⚡ <span>{xp}</span>
          </div>
          <button onClick={() => onNavigate('home')} className="text-gray-500 hover:text-blue-600 transition">Home</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
