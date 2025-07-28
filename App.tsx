import React, { useState, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { MessageInput } from './components/MessageInput';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ChatMessage, Tool } from './types';
import { TOOLS } from './constants';
import { startChatSession } from './services/geminiService';

const API_KEY_STORAGE_KEY = 'gemini-api-key';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem(API_KEY_STORAGE_KEY));
  const [activeTool, setActiveTool] = useState<Tool>(TOOLS[0]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initializeChat = useCallback(async () => {
    if (!apiKey) return;

    setIsLoading(true);
    setError(null);
    try {
      const newChatSession = await startChatSession(apiKey, activeTool.systemInstruction);
      setChatSession(newChatSession);
      setMessages([
        {
          id: 'initial-message',
          role: 'model',
          content: `Hello! I'm now acting as a ${activeTool.name}. How can I help you today?`,
        },
      ]);
    } catch (err) {
      console.error("Failed to initialize chat session:", err);
      setError('Could not start a chat session. Please ensure your API key is valid and has access to the Gemini API.');
      setApiKey(null); // Clear the invalid key
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, activeTool]);

  useEffect(() => {
    // Only initialize if an API key is present
    if (apiKey) {
      initializeChat();
    }
  }, [apiKey, initializeChat]);

  const handleSaveApiKey = (newKey: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, newKey);
    setApiKey(newKey);
    setError(null);
  };

  const handleSelectTool = (tool: Tool) => {
    setActiveTool(tool);
    // Re-initialize chat with the new persona
    if (apiKey) {
      initializeChat();
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!chatSession || isLoading) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    };
    
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

    } catch (err) {
      console.error("Error sending message:", err);
      setMessages(prev => prev.map(msg => 
        msg.id === modelMessageId ? { ...msg, content: 'Sorry, I encountered an error. This could be due to a network issue or a problem with the API key. Please try again.' } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  if (!apiKey) {
    return <ApiKeyModal onSave={handleSaveApiKey} error={error} />;
  }

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
