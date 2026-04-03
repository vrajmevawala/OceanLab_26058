'use client';
import React, { useState, useRef } from 'react';
import { useBotStore } from '@/stores/bot.store';
import { SendIcon, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export function ChatInput() {
  const [text, setText] = useState('');
  const { addMessage, setStreaming, isStreaming } = useBotStore();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!text.trim() || isStreaming) return;

    const userMsg = text;
    setText('');
    addMessage({ role: 'user', content: userMsg });
    
    // Placeholder for API call
    setStreaming(true);
    addMessage({ role: 'assistant', content: '' });
    
    // Simulate streaming for now
    setTimeout(() => {
      setStreaming(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="relative flex items-end gap-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 focus-within:border-[var(--accent)] transition-all shadow-sm">
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          rows={1}
          className="flex-1 bg-transparent border-none outline-none text-[13px] text-[var(--text)] resize-none py-1 min-h-[22px] max-h-32 scrollbar-hide"
          style={{ height: 'auto' }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || isStreaming}
          className={clsx(
            'p-1.5 rounded-lg transition-all shrink-0',
            text.trim() && !isStreaming 
              ? 'bg-[var(--accent)] text-[#0d1117] hover:opacity-90' 
              : 'text-[var(--text-dim)] cursor-not-allowed'
          )}
        >
          <SendIcon size={14} />
        </button>
      </div>
      <div className="flex items-center gap-1.5 mt-2 px-1 text-[10px] text-[var(--text-dim)] font-medium">
        <Sparkles size={10} className="text-[var(--accent)]" />
        <span>Context-aware: Analyzing {`api/userController.js`}</span>
      </div>
    </div>
  );
}
