
import React from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export interface Tool {
  id:string;
  name: string;
  description: string;
  systemInstruction: string;
  icon: React.ReactNode;
}
