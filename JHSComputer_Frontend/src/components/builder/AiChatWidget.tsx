'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Loader2 } from 'lucide-react';
import type { QuoteInput } from '@/lib/v1-types';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:6002/api';

type ChatMessage = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

export function AiChatWidget({
  currentInput,
  onUpdateInput,
  onGenerate
}: {
  currentInput: QuoteInput;
  onUpdateInput: (input: Partial<QuoteInput>) => void;
  onGenerate: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([
    {
      role: 'model',
      parts: [{ text: '안녕하세요! JHS Computer AI 수석 상담원입니다. 어떤 용도로 PC를 맞추고 싶으신가요? 예산이나 원하시는 게임을 편하게 말씀해 주세요!' }]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [history, isOpen]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = inputMessage.trim();
    setInputMessage('');
    const newHistory: ChatMessage[] = [...history, { role: 'user', parts: [{ text: userMsg }] }];
    setHistory(newHistory);
    setIsLoading(true);

    try {
      // Gemini API requires history to start with a 'user' message. 
      // We slice off the initial hardcoded 'model' greeting if it's the first element.
      let apiHistory = newHistory.slice(0, -1);
      if (apiHistory.length > 0 && apiHistory[0].role === 'model') {
        apiHistory = apiHistory.slice(1);
      }

      const res = await fetch(`${apiBaseUrl}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: apiHistory, message: userMsg })
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();

      setHistory(prev => [...prev, { role: 'model', parts: [{ text: data.message }] }]);

      if (data.action) {
        onUpdateInput(data.action);
        // Automatically trigger generate after a short delay so user sees the parameters change first
        setTimeout(() => {
          onGenerate();
        }, 1500);
      }
    } catch (error) {
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: '죄송합니다. 현재 상담 서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.' }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-brand text-white rounded-full shadow-lg hover:bg-teal-700 transition-all hover:scale-105 z-50 flex items-center gap-3 animate-in fade-in zoom-in"
      >
        <Bot size={24} />
        <span className="font-black pr-1 hidden sm:inline-block">AI 견적 상담원</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[360px] h-[520px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-line overflow-hidden animate-in slide-in-from-bottom-10 fade-in">
      {/* Header */}
      <div className="bg-brand text-white p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-black text-sm">AI 수석 상담원</h3>
            <p className="text-[10px] text-teal-100 font-bold">실시간 맞춤 견적 지원</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-teal-100 hover:text-white p-1 rounded-full hover:bg-white/10 transition">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50">
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-bold leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-brand text-white rounded-tr-sm' 
                : 'bg-white border border-line text-slate-700 rounded-tl-sm'
            }`}>
              {msg.parts[0].text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-line text-slate-500 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs font-bold">견적을 고민하고 있어요...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-line">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="예: 배그용 150만원대 견적 짜줘"
            className="w-full bg-panel border border-line rounded-xl pl-4 pr-12 py-3 text-sm font-bold outline-none focus:border-brand focus:ring-1 focus:ring-brand/20 transition"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !inputMessage.trim()}
            className="absolute right-2 p-1.5 text-brand disabled:text-slate-300 hover:bg-teal-50 rounded-lg transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
