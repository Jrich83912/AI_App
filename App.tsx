import React, { useState, useEffect, useRef } from 'react';
import { GenerateContentResponse } from '@google/genai';
import { Menu } from 'lucide-react';

import { Message } from './types';
import { SUGGESTED_PROMPTS, MILESTONES } from './constants';
import { sendMessageStream, initializeChat } from './services/geminiService';

import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar';
import GlossaryModal from './components/GlossaryModal';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Create a placeholder for the bot response
    const botMessageId = (Date.now() + 1).toString();
    const botMessagePlaceholder: Message = {
      id: botMessageId,
      role: 'model',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, botMessagePlaceholder]);

    try {
      const stream = await sendMessageStream(text, messages);
      
      let fullContent = '';
      
      for await (const chunk of stream) {
        const chunkText = (chunk as GenerateContentResponse).text;
        if (chunkText) {
          fullContent += chunkText;
          setMessages((prev) => 
            prev.map((msg) => 
              msg.id === botMessageId 
                ? { ...msg, content: fullContent } 
                : msg
            )
          );
        }
      }

      // Final update to remove streaming status
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMessageId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );

    } catch (error) {
      console.error("Error sending message:", error);
      // Update the placeholder with an error message
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === botMessageId 
            ? { ...msg, content: "I encountered a connection error. Please try again.", isStreaming: false } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMilestone = (id: string) => {
    const isCurrentlyCompleted = completedMilestones.includes(id);
    
    // Update state
    setCompletedMilestones(prev => 
      isCurrentlyCompleted 
        ? prev.filter(m => m !== id)
        : [...prev, id]
    );

    // If marking as complete, trigger the chat message
    if (!isCurrentlyCompleted) {
      const milestone = MILESTONES.find(m => m.id === id);
      if (milestone) {
        // We close the sidebar on mobile to show the chat
        if (window.innerWidth < 768) {
          setSidebarOpen(false);
        }
        handleSend(milestone.triggerMessage);
      }
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        completedMilestones={completedMilestones}
        onToggleMilestone={handleToggleMilestone}
        onOpenGlossary={() => setGlossaryOpen(true)}
      />

      <GlossaryModal isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full">
        {/* Header */}
        <header className="flex-shrink-0 bg-white border-b border-slate-200 h-16 flex items-center px-4 justify-between md:justify-end z-10 shadow-sm">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 font-medium">
             <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
               System Online
             </span>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-3xl mx-auto px-4 py-8">
            
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-fade-in-up">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-2">
                   <span className="text-4xl">🎓</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Hello, Future Entrepreneur!</h2>
                  <p className="text-slate-500 max-w-md mx-auto">
                    I'm your E-Com Mentor. I'm here to guide you through the Austin Rabin 2025 Strategy, from setup to your first sale.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mt-8">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      disabled={isLoading}
                      className="text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all duration-200 group"
                    >
                      <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700">{prompt}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area */}
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;