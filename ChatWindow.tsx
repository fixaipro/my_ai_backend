
import React, { useEffect, useRef } from 'react';
import { ChatMessage, Tool } from '../types';
import { Message } from './Message';

interface ChatWindowProps {
  messages: ChatMessage[];
  activeTool: Tool;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, activeTool }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="h-full space-y-4 overflow-y-auto">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} activeTool={activeTool} />
      ))}
      <div />
    </div>
  );
};
