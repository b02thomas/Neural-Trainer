'use client';

import { useCallback, useRef } from 'react';
import { useCoachStore } from '@/stores/coach-store';

export function useCoachChat() {
  const {
    currentConversation,
    isLoading,
    isStreaming,
    streamingContent,
    error,
    preferences,
    addUserMessage,
    startStreaming,
    appendStreamContent,
    finalizeAssistantMessage,
    setError,
    startNewConversation,
  } = useCoachStore();

  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    // Ensure we have a conversation
    if (!currentConversation) {
      startNewConversation();
    }

    // Add user message to store
    addUserMessage(content);

    // Get the current conversation after adding user message
    const state = useCoachStore.getState();
    const conversation = state.currentConversation;

    if (!conversation) {
      setError('No active conversation');
      return;
    }

    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      startStreaming();

      const response = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversation.messages,
          focusArea: conversation.focusArea,
          style: preferences.coachingStyle,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response');
      }

      // Read the stream
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                appendStreamContent(parsed.content);
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }

      // Finalize the assistant message
      finalizeAssistantMessage('anthropic/claude-3.5-sonnet');
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was aborted, don't set error
        return;
      }

      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [
    currentConversation,
    preferences.coachingStyle,
    addUserMessage,
    startNewConversation,
    startStreaming,
    appendStreamContent,
    finalizeAssistantMessage,
    setError,
  ]);

  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    // If we were streaming, finalize what we have
    if (isStreaming && streamingContent) {
      finalizeAssistantMessage('anthropic/claude-3.5-sonnet');
    }
  }, [isStreaming, streamingContent, finalizeAssistantMessage]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    messages: currentConversation?.messages || [],
    isLoading,
    isStreaming,
    streamingContent,
    error,
    sendMessage,
    cancelStream,
    clearError,
    currentConversation,
    startNewConversation,
  };
}
