
import React from 'react';
import { Tool } from './types';

const GeneralIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="12.5" x2="11.5" y1="4" y2="20"/></svg>
);

const WriterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M12 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-4z"/><path d="M16 2v4h-4"/><path d="M12.5 10h-1"/><path d="M12.5 14h-1"/><path d="M12.5 18h-1"/></svg>
);

const MarketingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="m2 12 h2"/><path d="m20 12 h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 6.34 1.41-1.41"/></svg>
);


export const TOOLS: Tool[] = [
  {
    id: 'general',
    name: 'General Assistant',
    description: 'A helpful AI for general questions, brainstorming, and daily tasks.',
    systemInstruction: 'You are a friendly and helpful general-purpose AI assistant. Your goal is to provide accurate, concise, and clear information to the user. Be polite and encouraging.',
    icon: <GeneralIcon />,
  },
  {
    id: 'code',
    name: 'Code Generator',
    description: 'Generates code snippets in various programming languages.',
    systemInstruction: 'You are an expert programmer AI. Your primary function is to write clean, efficient, and well-documented code based on user requests. Always specify the language and provide explanations for complex parts. Use markdown for code blocks.',
    icon: <CodeIcon />,
  },
  {
    id: 'writer',
    name: 'Creative Writer',
    description: 'Helps with writing stories, poems, scripts, and other creative content.',
    systemInstruction: 'You are a creative writer AI, a master of storytelling and prose. Your purpose is to help users craft compelling narratives, beautiful poetry, and engaging content. Adopt a vivid and imaginative tone.',
    icon: <WriterIcon />,
  },
  {
    id: 'marketing',
    name: 'Marketing Expert',
    description: 'Creates marketing copy, ad campaigns, and social media content.',
    systemInstruction: 'You are a savvy marketing expert AI. You specialize in creating persuasive and effective marketing copy. Your responses should be tailored to the target audience and platform, focusing on brand voice and calls to action.',
    icon: <MarketingIcon />,
  },
];
