'use client';

import { memo } from 'react';
import { motion } from 'motion/react';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { CoachMessage } from '@/types/coach';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: CoachMessage;
  isStreaming?: boolean;
  streamingContent?: string;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const MessageBubble = memo(function MessageBubble({
  message,
  isStreaming,
  streamingContent,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const content = isStreaming ? streamingContent || '' : message.content;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-3 w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-cyan-400" />
        </div>
      )}

      {/* Message content */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-cyan-500/20 text-foreground'
            : 'glass-card border border-white/5'
        )}
      >
        {/* Message text */}
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-cyan-400 animate-pulse" />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
          <span className="text-xs text-muted-foreground">
            {formatTime(message.createdAt)}
          </span>

          {/* Copy button for assistant messages */}
          {!isUser && !isStreaming && content && (
            <button
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Copy message"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
          <User className="w-4 h-4 text-purple-400" />
        </div>
      )}
    </motion.div>
  );
});
