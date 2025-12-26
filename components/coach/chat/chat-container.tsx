'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bot, Sparkles } from 'lucide-react';
import { useCoachChat } from '@/hooks/use-coach-chat';
import { useCoachStore } from '@/stores/coach-store';
import { SUGGESTED_PROMPTS } from '@/types/coach';
import { MessageBubble } from './message-bubble';
import { ChatInput } from './chat-input';
import { StreamingIndicator } from './streaming-indicator';
import { cn } from '@/lib/utils';

interface ChatContainerProps {
  className?: string;
}

export function ChatContainer({ className }: ChatContainerProps) {
  const {
    messages,
    isLoading,
    isStreaming,
    streamingContent,
    error,
    sendMessage,
    cancelStream,
    clearError,
    currentConversation,
  } = useCoachChat();

  const { preferences } = useCoachStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingContent]);

  // Get suggested prompts for current focus area
  const suggestedPrompts = SUGGESTED_PROMPTS.filter(
    (p) =>
      p.focusArea === currentConversation?.focusArea ||
      p.focusArea === preferences.focusAreas[0]
  ).slice(0, 3);

  const isEmpty = messages.length === 0;

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6"
            >
              <Bot className="w-10 h-10 text-cyan-400" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold mb-2"
            >
              How are you feeling today?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground mb-8 max-w-md"
            >
              I&apos;m here to help you work through challenges, develop insights,
              and build mental resilience.
            </motion.p>

            {/* Suggested prompts */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-md space-y-2"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Sparkles className="w-4 h-4" />
                Try one of these:
              </div>

              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => sendMessage(prompt.text)}
                  disabled={isLoading || isStreaming}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl',
                    'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20',
                    'transition-all duration-200',
                    'text-sm text-muted-foreground hover:text-foreground',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {prompt.text}
                </button>
              ))}
            </motion.div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <div
                key={message.id}
                ref={index === messages.length - 1 ? lastMessageRef : undefined}
              >
                <MessageBubble message={message} />
              </div>
            ))}

            {/* Streaming message */}
            {isStreaming && streamingContent && (
              <div ref={lastMessageRef}>
                <MessageBubble
                  message={{
                    id: 'streaming',
                    role: 'assistant',
                    content: '',
                    createdAt: Date.now(),
                  }}
                  isStreaming
                  streamingContent={streamingContent}
                />
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && !isStreaming && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="glass-card px-4 py-3 border border-white/5">
                  <StreamingIndicator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Error display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-2"
          >
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 text-sm text-red-400 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-300"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="flex-shrink-0 p-4 border-t border-white/5">
        <ChatInput
          onSend={sendMessage}
          onCancel={cancelStream}
          isLoading={isLoading}
          isStreaming={isStreaming}
          placeholder="Share what's on your mind..."
        />
        <p className="text-xs text-muted-foreground text-center mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
