
import React, { useState, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { MessageInput } from './components/MessageInput';
import { ChatMessage, Tool } from './types';
import { TOOLS } from './constants';
import { startChatSession } from './services/geminiService';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>(TOOLS[0]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initializeChat = useCallback(() => {
    setIsLoading(true);
    try {
      const newChatSession = startChatSession(activeTool.systemInstruction);
      setChatSession(newChatSession);
      setMessages([
        {
          id: 'initial-message',
          role: 'model',
          content: `Hello! I'm now acting as a ${activeTool.name}. How can I help you today?`,
        },
      ]);
    } catch (error) {
      console.error("Failed to initialize chat session:", error);
      setMessages([
        {
          id: 'error-message',
          role: 'model',
          content: 'Error: Could not start a chat session. Please check your API key and network connection.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTool]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const handleSelectTool = (tool: Tool) => {
    setActiveTool(tool);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!chatSession || isLoading) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    };
    
    // Add user message and an empty model message shell to the chat
    const modelMessageId = (Date.now() + 1).toString();
    setMessages(prevMessages => [
      ...prevMessages,
      userMessage,
      {
        id: modelMessageId,
        role: 'model',
        content: '', // Empty content will trigger the typing indicator
      },
    ]);

    try {
      const stream = await chatSession.sendMessageStream({ message: messageText });
      
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === modelMessageId ? { ...msg, content: fullResponse } : msg
          )
        );
      }

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === modelMessageId ? { ...msg, content: 'Sorry, I encountered an error. Please try again.' } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen font-sans bg-gray-900 text-gray-100">
      <Sidebar
        tools={TOOLS}
        activeTool={activeTool}
        onSelectTool={handleSelectTool}
      />
      <div className="flex flex-col flex-1">
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 shadow-md z-10">
          <h1 className="text-xl font-bold flex items-center gap-3">
            {activeTool.icon}
            {activeTool.name}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{activeTool.description}</p>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <ChatWindow messages={messages} activeTool={activeTool} />
        </main>
        <footer className="p-4 md:p-6 border-t border-gray-700 bg-gray-900">
          <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </footer>
      </div>
    </div>
  );
};

export default App;
