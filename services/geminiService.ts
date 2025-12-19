import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Message } from '../types';

let chatSession: Chat | null = null;

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = (): Chat => {
  const ai = getClient();
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7, // Balanced creativity and instruction
    },
  });
  return chatSession;
};

export const sendMessageStream = async (
  message: string,
  history: Message[]
): Promise<AsyncIterable<GenerateContentResponse>> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    throw new Error("Failed to initialize chat session");
  }

  // Gemini SDK manages history internally in the `chatSession` object.
  // We only send the new user message here.
  
  try {
    const responseStream = await chatSession.sendMessageStream({ message });
    return responseStream;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // If the session is invalid or errored, try re-initializing once
    initializeChat();
    if(chatSession) {
        return await chatSession.sendMessageStream({ message });
    }
    throw error;
  }
};
