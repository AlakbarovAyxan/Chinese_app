import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="flex items-center gap-4 w-full max-w-2xl mx-auto p-4">
      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-duoGreen transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
