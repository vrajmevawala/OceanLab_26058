'use client';
import { useState, useRef, useEffect } from 'react';
import { useBotStore } from '@/stores/bot.store';

export function useBotStream() {
  const { conversationId, updateLastMessage, setStreaming } = useBotStore();
  
  const sendMessage = async (message: string, context: any) => {
    setStreaming(true);
    
    try {
      const response = await fetch('/api/bot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationId, context }),
      });

      if (!response.ok) throw new Error('Stream failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.token) {
              updateLastMessage(data.token);
            }
          }
        }
      }
    } catch (error) {
      console.error('SSE Error:', error);
      updateLastMessage('\n\n*Error: Connection to assistant lost.*');
    } finally {
      setStreaming(false);
    }
  };

  return { sendMessage };
}
