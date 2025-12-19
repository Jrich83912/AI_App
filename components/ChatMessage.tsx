import React from 'react';
import { Message } from '../types';
import { Bot, User, UserCircle2 } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Simple formatter to handle bold text (**text**) and newlines
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {formatText(line)}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3 items-start`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${isUser ? 'bg-indigo-600' : 'bg-emerald-600'} shadow-md`}>
          {isUser ? (
            <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
          ) : (
            <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
          )}
        </div>

        {/* Bubble */}
        <div
          className={`relative px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed
            ${isUser 
              ? 'bg-indigo-600 text-white rounded-tr-sm' 
              : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
            }`}
        >
          {renderContent(message.content)}
          {message.isStreaming && (
             <span className="inline-block w-2 h-4 ml-1 align-middle bg-emerald-500 animate-pulse"></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;