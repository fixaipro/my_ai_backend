import { GoogleGenAI, Chat } from '@google/genai';

export const startChatSession = async (apiKey: string, systemInstruction: string): Promise<Chat> => {
  if (!apiKey) {
    throw new Error("API_KEY is missing");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const chat: Chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      },
    });
    // Send a test message to validate the key and config
    await chat.sendMessage({message: 'hello'});
    return chat;
  } catch(e) {
    console.error("Error creating chat session in service:", e);
    // Re-throw the error to be caught by the UI
    throw e;
  }
};
