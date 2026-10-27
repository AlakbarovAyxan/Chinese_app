import React from 'react';
import { motion } from 'framer-motion';
import type { Question } from '../types';
import { speak } from '../utils/audio';

interface QuestionCardProps {
  question: Question;
  selectedOption: string | null;
  onOptionClick: (option: string) => void;
  isAnswerChecked: boolean;
  isCorrect: boolean | null;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  onOptionClick,
  isAnswerChecked,
  isCorrect,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{question.prompt}</h2>

      {/* Target Character / Word */}
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <div className="text-5xl sm:text-6xl font-extrabold text-gray-900">{question.targetWord}</div>
        {question.targetWord && (
          <button
            onClick={() => speak(question.targetWord!)}
            className="p-2 sm:p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
            title="Listen"
          >
            🔊
          </button>
        )}
      </div>
      {question.pinyin && <div className="text-xl sm:text-lg text-gray-500 font-medium mb-6 sm:mb-8">{question.pinyin}</div>}

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {question.options?.map((option) => {
          const isSelected = selectedOption === option;

          let btnClass = "bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors";
          if (isAnswerChecked) {
            if (option === question.correctAnswer) {
              btnClass = "bg-green-50 border-green-500 text-green-700 shadow-sm";
            } else if (isSelected) {
              btnClass = "bg-red-50 border-red-500 text-red-700 shadow-sm";
            }
          } else if (isSelected) {
            btnClass = "bg-blue-50 border-blue-500 text-blue-700 shadow-sm";
          }

          const isDisabled = isAnswerChecked;

          return (
            <motion.button
              key={option}
              onClick={() => onOptionClick(option)}
              disabled={isDisabled}
              initial={{ scale: 1 }}
              animate={
                isAnswerChecked
                  ? option === question.correctAnswer
                    ? { scale: [1, 1.04, 1] }
                    : isSelected
                    ? { x: [0, -8, 8, -8, 8, 0] }
                    : {}
                  : isSelected
                  ? { scale: 1.02 }
                  : {}
              }
              transition={{ duration: 0.3 }}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              className={`p-4 sm:p-5 rounded-2xl font-semibold text-lg text-left transition-all cursor-pointer ${btnClass}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;