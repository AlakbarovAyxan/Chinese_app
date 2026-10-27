import React from 'react';
import { MOCK_NODES, type SkillNode } from './PathNavigator'; // Reuse mock data

interface PathViewProps {
  onNodeClick: (node: SkillNode) => void;
}

const PathView: React.FC<PathViewProps> = ({ onNodeClick }) => {
  return (
    <div className="relative w-full min-h-[800px] bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Your Mandarin Path</h2>
      <div className="relative max-w-lg mx-auto">
        {/* Simple vertical snake path */}
        {MOCK_NODES.map((node, index) => (
          <div key={node.id} className="flex flex-col items-center mb-16 relative">
            {index < MOCK_NODES.length - 1 && (
              <div className="absolute top-16 h-16 w-1 bg-gray-200 -z-10" />
            )}
            <button
              onClick={() => onNodeClick(node)}
              className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl shadow-lg transition-all transform hover:scale-110 ${
                node.status === 'completed' ? 'bg-green-500 text-white' :
                node.status === 'unlocked' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}
            >
              {node.status === 'completed' ? '✓' : node.title[0]}
            </button>
            <span className="mt-2 font-semibold text-gray-700">{node.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PathView;
