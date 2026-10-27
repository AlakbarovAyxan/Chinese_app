import React, { useState } from 'react';

	// Simplified node structure for PathNavigator
	export interface SkillNode {
	  id: string;
	  title: string;
	  category: string;
	  position_x: number;
	  position_y: number;
	  status: 'locked' | 'unlocked' | 'completed';
	}

	export const MOCK_NODES: SkillNode[] = [
	  { id: 'n1', title: 'Greetings', category: 'Basic', position_x: 200, position_y: 100, status: 'completed' },
	  { id: 'n2', title: 'Numbers', category: 'Basic', position_x: 350, position_y: 250, status: 'unlocked' },
	  { id: 'n3', title: 'Food', category: 'Basic', position_x: 200, position_y: 400, status: 'locked' },
	  { id: 'n4', title: 'Family', category: 'Intermediate', position_x: 50, position_y: 550, status: 'locked' },
	];

	const PathNavigator: React.FC = () => {
	  const [nodes, setNodes] = useState(MOCK_NODES);

	  const handleNodeClick = (id: string) => {
	    // Basic state machine: toggle completed status for demo
	    setNodes(prev => prev.map(n => n.id === id ? { ...n, status: n.status === 'completed' ? 'unlocked' : 'completed' } : n));
	  };

	  return (
	    <div className="relative w-full h-[800px] bg-surface p-10 overflow-hidden">
	      <h1 className="text-display font-sans font-bold text-text mb-10">Mandarin Path</h1>
	      <svg className="absolute top-0 left-0 w-full h-full -z-10">
	        <path
	          d={`M ${MOCK_NODES[0].position_x + 32} ${MOCK_NODES[0].position_y + 32} Q 350 150 ${MOCK_NODES[1].position_x + 32} ${MOCK_NODES[1].position_y + 32} T ${MOCK_NODES[2].position_x + 32} ${MOCK_NODES[2].position_y + 32} T ${MOCK_NODES[3].position_x + 32} ${MOCK_NODES[3].position_y + 32}`}
	          fill="none"
	          stroke="#e2e8f0"
	          strokeWidth="12"
	          strokeLinecap="round"
	        />
	      </svg>
	      {nodes.map((node) => (
	        <button
	          key={node.id}
	          onClick={() => handleNodeClick(node.id)}
	          className={`absolute w-16 h-16 rounded-pill shadow-button flex items-center justify-center font-bold text-sm cursor-pointer transition-all hover:scale-105 ${
	            node.status === 'completed' ? 'bg-success text-on-accent' :
	            node.status === 'unlocked' ? 'bg-accent text-on-accent' : 'bg-surface text-text-muted border-2 border-border'
	          }`}
	          style={{ left: node.position_x, top: node.position_y }}
	        >
	          {node.title[0]}
	        </button>
	      ))}
	    </div>
	  );
	};

	export default PathNavigator;
