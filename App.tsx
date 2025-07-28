
import React, { useState, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { MessageInput } from './components/MessageInput';
import { ChatMessage, Tool } from './types';
import { TOOLS } from './constants';
import { startChatSession, getApiKey } from './services/geminiService';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>(TOOLS[0]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isKeyAvailable, setIsKeyAvailable] = useState<boolean | null>(null);

  const initializeChat = useCallback(() => {
    setIsLoading(true);
    setMessages([]);

    const apiKey = getApiKey();
    if (!apiKey) {
      setIsKeyAvailable(false);
      setMessages([
        {
          id: 'error-message',
          role: 'model',
          content: `## API Key Not Found

**Error:** Could not connect to the AI service.

Please ensure your API key is configured correctly in your hosting environment's secret variables.

**Required Build Command:**
For services like Render, set your build command to:
\`\`\`
echo "window._env_ = { API_KEY: '$API_KEY' }" > env.js
\`\`\`
`,
        },
      ]);
      setIsLoading(false);
      return;
    }
    
    setIsKeyAvailable(true);
    try {
      const newChatSession = startChatSession(activeTool.systemInstruction);
      if (!newChatSession) {
        throw new Error("Failed to initialize chat session; the AI client could not be created.");
      }
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
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setMessages([
        {
          id: 'error-message',
          role: 'model',
          content: `**Error:** Could not start a chat session. \n**Details:** ${errorMessage}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTool]);

  useEffect(() => {
    // A small delay to ensure env.js has loaded
    setTimeout(initializeChat, 50);
  }, [initializeChat]);

  const handleSelectTool = (tool: Tool) => {
    setActiveTool(tool);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!chatSession || isLoading || !isKeyAvailable) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    const modelMessageId = (Date.now() + 1).toString();
    const modelMessage: ChatMessage = {
        id: modelMessageId,
        role: 'model',
        content: '',
    };
    setMessages([...updatedMessages, modelMessage]);

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
      setMessages(prev => [...prev.slice(0, -1), {
          id: modelMessageId,
          role: 'model',
          content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const ActiveIcon = activeTool.icon;

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
            <ActiveIcon />
            {activeTool.name}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{activeTool.description}</p>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <ChatWindow messages={messages} isLoading={isLoading} activeTool={activeTool} />
        </main>
        <footer className="p-4 md:p-6 border-t border-gray-700 bg-gray-900">
          <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading || !isKeyAvailable} />
        </footer>
      </div>
    </div>
  );
};

export default App;
