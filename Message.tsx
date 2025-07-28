
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage, Tool } from '../types';

interface MessageProps {
  message: ChatMessage;
  activeTool: Tool;
}

const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-indigo-300"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export const Message: React.FC<MessageProps> = ({ message, activeTool }) => {
  const isUser = message.role === 'user';
  
  const ModelIcon = activeTool.icon;
  const icon = isUser ? <UserIcon /> : <ModelIcon />;

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mt-1">{icon}</div>}
      <div className={`max-w-xl rounded-xl px-4 py-3 shadow-md ${isUser ? 'bg-indigo-600 text-white' : 'bg-gray-700/80 text-gray-200'}`}>
        <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:my-3">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Customize code blocks for better styling
                    code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline ? (
                            <pre className="bg-gray-900/80 rounded-md p-3 my-2 text-sm font-mono overflow-x-auto">
                                <code className={`language-${match ? match[1] : 'text'}`} {...props}>
                                    {children}
                                </code>
                            </pre>
                        ) : (
                            <code className="bg-gray-800 px-1.5 py-0.5 rounded-md font-mono text-sm" {...props}>
                                {children}
                            </code>
                        );
                    }
                }}
            >
                {message.content}
            </ReactMarkdown>
        </div>
      </div>
       {isUser && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mt-1">{icon}</div>}
    </div>
  );
};
