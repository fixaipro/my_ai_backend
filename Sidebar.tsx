
import React from 'react';
import { Tool } from '../types';
import { ToolIcon } from './ToolIcon';

interface SidebarProps {
  tools: Tool[];
  activeTool: Tool;
  onSelectTool: (tool: Tool) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ tools, activeTool, onSelectTool }) => {
  return (
    <aside className="w-64 bg-gray-900/70 backdrop-blur-lg border-r border-gray-700/50 p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
        <h2 className="text-2xl font-bold tracking-wider">AI Tools</h2>
      </div>
      <nav className="flex flex-col gap-2">
        {tools.map((tool) => (
          <ToolIcon key={tool.id} tool={tool} isActive={tool.id === activeTool.id} onClick={() => onSelectTool(tool)} />
        ))}
      </nav>
    </aside>
  );
};
