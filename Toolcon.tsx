
import React from 'react';
import { Tool } from '../types';

interface ToolIconProps {
  tool: Tool;
  isActive: boolean;
  onClick: () => void;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ tool, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors duration-200 ${
        isActive
          ? 'bg-indigo-600/30 text-white font-semibold'
          : 'text-gray-300 hover:bg-gray-700/50'
      }`}
    >
      <div className="flex-shrink-0">{tool.icon}</div>
      <span>{tool.name}</span>
    </button>
  );
};
