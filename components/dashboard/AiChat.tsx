import React, { useState, useRef, useEffect } from 'react';
import { getOpenRouterChatResponse } from '../../services/openRouterService';
import { getUserName } from '../../services/storageService';
import { ChatMessage } from '../../types';
import { Button } from '../Button';
import { Send, User } from 'lucide-react';

export const AiChat: React.FC = () => {
  // Initialize user name and greeting
  const [userName] = useState<string>(() => getUserName());
  
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { 
      id: 'init', 
      role: 'model', 
      text: `Halo, ${userName}! Selamat datang di TherraBiz. Saya Therra AI, asisten cerdas Anda. Ada yang bisa saya bantu untuk mengembangkan bisnis hari ini?`, 
      timestamp: Date.now() 
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || cooldown > 0) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setCooldown(3); // 3 seconds cooldown as per request

    try {
      // Pass the userName to the service so the AI knows the context
      const responseText = await getOpenRouterChatResponse(messages, userMsg.text, userName);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[75vh] min-h-[500px] flex flex-col bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-primary-600/20">
          <img src="../../images/therra.png" alt="Therra AI" className="w-full h-full object-cover rounded-full" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-100">Therra AI Assistant</h3>
          <p className="text-xs text-slate-400">Smart Business Consultant</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800/50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden
              ${msg.role === 'user' ? 'bg-slate-600' : 'bg-primary-600/20'}
            `}>
              {msg.role === 'user' ? (
                <User size={14} />
              ) : (
                <img src="/src/images/Therra.png" alt="AI" className="w-full h-full object-cover" />
              )}
            </div>
            <div className={`
              max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
              ${msg.role === 'user' 
                ? 'bg-slate-700 text-slate-100 rounded-tr-none' 
                : 'bg-primary-900/30 text-slate-200 border border-primary-500/20 rounded-tl-none'}
            `}>
              {msg.text.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-sm ml-12">
            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></span>
            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900/80 border-t border-slate-700 backdrop-blur-sm">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-slate-500"
            placeholder={cooldown > 0 ? `Tunggu ${cooldown}s...` : "Ketik pesan..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || cooldown > 0}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim() || cooldown > 0}
            className="w-12 h-12 !px-0 rounded-xl flex items-center justify-center"
          >
            <Send size={18} />
          </Button>
        </form>
        <p className="text-center text-[10px] text-slate-500 mt-2">
          Therra AI mungkin membuat kesalahan. Cek kembali informasi penting.
        </p>
      </div>
    </div>
  );
};