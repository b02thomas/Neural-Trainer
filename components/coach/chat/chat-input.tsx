'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  onSend,
  onCancel,
  isLoading,
  isStreaming,
  placeholder = 'Type your message...',
  className,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (!message.trim() || isLoading || isStreaming) return;
    onSend(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isDisabled = !message.trim() || isLoading;

  return (
    <div className={cn('flex items-end gap-3', className)}>
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading || isStreaming}
          rows={1}
          className={cn(
            'w-full resize-none rounded-xl px-4 py-3 pr-12',
            'bg-white/5 border border-white/10',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50',
            'placeholder:text-muted-foreground',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200'
          )}
        />
      </div>

      {isStreaming ? (
        <Button
          onClick={onCancel}
          variant="outline"
          size="icon"
          className="flex-shrink-0 w-11 h-11 rounded-xl bg-red-500/20 hover:bg-red-500/30 border-red-500/30"
        >
          <Square className="w-4 h-4 text-red-400" />
        </Button>
      ) : (
        <Button
          onClick={handleSubmit}
          disabled={isDisabled}
          size="icon"
          className={cn(
            'flex-shrink-0 w-11 h-11 rounded-xl transition-all',
            isDisabled
              ? 'bg-white/10 text-muted-foreground'
              : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 glow-cyan'
          )}
        >
          <Send className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
