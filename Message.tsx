
import React from 'react';
import { ChatMessage, Tool } from '../types';

interface MessageProps {
  message: ChatMessage;
  activeTool: Tool;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center justify-start space-x-1 p-3">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
  </div>
);

// A simple markdown-like parser for bold text and code blocks
const FormattedContent: React.FC<{ content: string }> = ({ content }) => {
    // This regex splits the text by code blocks (```...```) and captures them.
    const parts = content.split(/(```[\s\S]*?```)/g);

    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('```') && part.endsWith('```')) {
                    const code = part.substring(3, part.length - 3).trim();
                    const languageHint = code.split('\n')[0].trim();
                    // A simple check if the first line is a language hint (e.g., 'javascript', 'python')
                    const isLanguageHint = /^[a-z]+$/.test(languageHint) && !languageHint.includes(' ');
                    const actualCode = isLanguageHint ? code.substring(languageHint.length).trim() : code;

                    return (
                        <pre key={index} className="bg-gray-900/80 rounded-md p-3 my-2 overflow-x-auto text-sm text-green-300 font-mono">
                            <code>{actualCode}</code>
                        </pre>
                    );
                }
                
                // Process bold text **text**
                const boldParts = part.split(/(\*\*.*?\*\*)/g).map((subPart, subIndex) => {
                    if (subPart.startsWith('**') && subPart.endsWith('**')) {
                        return <strong key={subIndex}>{subPart.substring(2, subPart.length - 2)}</strong>;
                    }
                    return subPart;
                });

                return <span key={index}>{boldParts}</span>;
            })}
        </>
    );
};

export const Message: React.FC<MessageProps> = ({ message, activeTool }) => {
  const isUser = message.role === 'user';
  const isTyping = message.role === 'model' && message.content === '';
  
  const icon = isUser ? 
    (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-indigo-300"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>) :
    activeTool.icon;

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mt-1">{icon}</div>}
      <div className={`max-w-xl rounded-xl px-4 py-3 shadow-md ${isUser ? 'bg-indigo-600 text-white' : 'bg-gray-700/80 text-gray-200'}`}>
        {isTyping ? <TypingIndicator /> : (
            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                <FormattedContent content={message.content} />
            </div>
        )}
      </div>
       {isUser && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mt-1">{icon}</div>}
    </div>
  );
};
