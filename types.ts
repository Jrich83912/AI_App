export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export enum View {
  CHAT = 'CHAT',
  RESOURCES = 'RESOURCES',
}

export interface Milestone {
  id: string;
  label: string;
  triggerMessage: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}
