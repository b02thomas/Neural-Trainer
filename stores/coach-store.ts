import { create } from 'zustand';
import {
  CoachState,
  Conversation,
  CoachMessage,
  EmotionalLog,
  PatternInsight,
  CoachPreferences,
  FocusArea,
  Emotion,
  CoachingStyle,
  AIModel,
  DEFAULT_COACH_PREFERENCES,
} from '@/types/coach';

interface CoachStore extends CoachState {
  // Conversation actions
  startNewConversation: (focusArea?: FocusArea) => void;
  loadConversation: (conversation: Conversation) => void;
  addUserMessage: (content: string) => void;
  startStreaming: () => void;
  appendStreamContent: (content: string) => void;
  finalizeAssistantMessage: (model?: AIModel, tokensUsed?: number) => void;
  setError: (error: string | null) => void;
  deleteConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;

  // Emotional logging actions
  logEmotion: (emotion: Emotion, intensity: number, context?: FocusArea, trigger?: string, notes?: string) => void;
  deleteEmotionalLog: (id: string) => void;

  // Insights actions
  addInsight: (insight: Omit<PatternInsight, 'id' | 'firstDetectedAt' | 'lastDetectedAt' | 'isAcknowledged'>) => void;
  acknowledgeInsight: (id: string) => void;
  updateInsightFrequency: (id: string) => void;

  // Preferences actions
  updatePreferences: (updates: Partial<CoachPreferences>) => void;
  completeOnboarding: () => void;
  addFocusArea: (area: FocusArea) => void;
  removeFocusArea: (area: FocusArea) => void;

  // UI actions
  setShowOnboarding: (show: boolean) => void;
  setShowEmotionLogger: (show: boolean) => void;

  // Data sync actions
  loadUserData: (data: {
    conversations: Conversation[];
    emotionalLogs: EmotionalLog[];
    insights: PatternInsight[];
    preferences: CoachPreferences;
  }) => void;
  getLastConversation: () => Conversation | null;
  getLastEmotionalLog: () => EmotionalLog | null;

  // Analytics helpers
  getEmotionTrends: (days?: number) => EmotionalLog[];
  getTopTriggers: (limit?: number) => Array<{ trigger: string; count: number }>;
  getConversationsByFocusArea: (focusArea: FocusArea) => Conversation[];
}

const DEFAULT_STATE: CoachState = {
  // Current conversation
  currentConversation: null,
  isLoading: false,
  isStreaming: false,
  streamingContent: '',
  error: null,

  // History
  conversations: [],
  emotionalLogs: [],
  insights: [],

  // Preferences
  preferences: DEFAULT_COACH_PREFERENCES,

  // UI State
  showOnboarding: false,
  showEmotionLogger: false,
};

// Track last items for Supabase sync
let lastConversation: Conversation | null = null;
let lastEmotionalLog: EmotionalLog | null = null;

export const useCoachStore = create<CoachStore>()((set, get) => ({
  ...DEFAULT_STATE,

  // Start a new conversation
  startNewConversation: (focusArea?: FocusArea) => {
    const state = get();
    const area = focusArea || state.preferences.focusAreas[0] || 'general';

    const conversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      focusArea: area,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set({
      currentConversation: conversation,
      isLoading: false,
      isStreaming: false,
      streamingContent: '',
      error: null,
    });
  },

  // Load an existing conversation
  loadConversation: (conversation: Conversation) => {
    set({
      currentConversation: conversation,
      isLoading: false,
      isStreaming: false,
      streamingContent: '',
      error: null,
    });
  },

  // Add a user message to current conversation
  addUserMessage: (content: string) => {
    const state = get();
    if (!state.currentConversation) return;

    const message: CoachMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: Date.now(),
    };

    const updatedConversation: Conversation = {
      ...state.currentConversation,
      messages: [...state.currentConversation.messages, message],
      updatedAt: Date.now(),
      // Auto-generate title from first message if still default
      title: state.currentConversation.title === 'New Conversation' && state.currentConversation.messages.length === 0
        ? content.slice(0, 50) + (content.length > 50 ? '...' : '')
        : state.currentConversation.title,
    };

    // Update conversations list
    const conversationIndex = state.conversations.findIndex(
      (c) => c.id === updatedConversation.id
    );

    let updatedConversations: Conversation[];
    if (conversationIndex >= 0) {
      updatedConversations = [
        ...state.conversations.slice(0, conversationIndex),
        updatedConversation,
        ...state.conversations.slice(conversationIndex + 1),
      ];
    } else {
      updatedConversations = [...state.conversations, updatedConversation];
    }

    lastConversation = updatedConversation;

    set({
      currentConversation: updatedConversation,
      conversations: updatedConversations,
      isLoading: true,
    });
  },

  // Start streaming response
  startStreaming: () => {
    set({
      isStreaming: true,
      isLoading: false,
      streamingContent: '',
    });
  },

  // Append content during streaming
  appendStreamContent: (content: string) => {
    set((state) => ({
      streamingContent: state.streamingContent + content,
    }));
  },

  // Finalize assistant message after streaming completes
  finalizeAssistantMessage: (model?: AIModel, tokensUsed?: number) => {
    const state = get();
    if (!state.currentConversation) return;

    const message: CoachMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: state.streamingContent,
      createdAt: Date.now(),
      model,
      tokensUsed,
    };

    const updatedConversation: Conversation = {
      ...state.currentConversation,
      messages: [...state.currentConversation.messages, message],
      updatedAt: Date.now(),
    };

    // Update conversations list
    const conversationIndex = state.conversations.findIndex(
      (c) => c.id === updatedConversation.id
    );

    let updatedConversations: Conversation[];
    if (conversationIndex >= 0) {
      updatedConversations = [
        ...state.conversations.slice(0, conversationIndex),
        updatedConversation,
        ...state.conversations.slice(conversationIndex + 1),
      ];
    } else {
      updatedConversations = [...state.conversations, updatedConversation];
    }

    lastConversation = updatedConversation;

    set({
      currentConversation: updatedConversation,
      conversations: updatedConversations,
      isStreaming: false,
      streamingContent: '',
    });
  },

  // Set error state
  setError: (error: string | null) => {
    set({
      error,
      isLoading: false,
      isStreaming: false,
    });
  },

  // Delete a conversation
  deleteConversation: (id: string) => {
    const state = get();
    set({
      conversations: state.conversations.filter((c) => c.id !== id),
      currentConversation:
        state.currentConversation?.id === id ? null : state.currentConversation,
    });
  },

  // Update conversation title
  updateConversationTitle: (id: string, title: string) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, title, updatedAt: Date.now() } : c
      ),
      currentConversation:
        state.currentConversation?.id === id
          ? { ...state.currentConversation, title, updatedAt: Date.now() }
          : state.currentConversation,
    }));
  },

  // Log an emotion
  logEmotion: (emotion, intensity, context, trigger, notes) => {
    const state = get();
    const log: EmotionalLog = {
      id: crypto.randomUUID(),
      emotion,
      intensity,
      context: context || state.preferences.focusAreas[0] || 'general',
      trigger,
      conversationId: state.currentConversation?.id,
      notes,
      loggedAt: Date.now(),
    };

    lastEmotionalLog = log;

    set({
      emotionalLogs: [...state.emotionalLogs.slice(-99), log],
      showEmotionLogger: false,
    });
  },

  // Delete an emotional log
  deleteEmotionalLog: (id: string) => {
    set((state) => ({
      emotionalLogs: state.emotionalLogs.filter((log) => log.id !== id),
    }));
  },

  // Add a new insight
  addInsight: (insight) => {
    const newInsight: PatternInsight = {
      ...insight,
      id: crypto.randomUUID(),
      firstDetectedAt: Date.now(),
      lastDetectedAt: Date.now(),
      isAcknowledged: false,
    };

    set((state) => ({
      insights: [...state.insights, newInsight],
    }));
  },

  // Acknowledge an insight
  acknowledgeInsight: (id: string) => {
    set((state) => ({
      insights: state.insights.map((insight) =>
        insight.id === id ? { ...insight, isAcknowledged: true } : insight
      ),
    }));
  },

  // Update insight frequency
  updateInsightFrequency: (id: string) => {
    set((state) => ({
      insights: state.insights.map((insight) =>
        insight.id === id
          ? {
              ...insight,
              frequency: insight.frequency + 1,
              lastDetectedAt: Date.now(),
            }
          : insight
      ),
    }));
  },

  // Update preferences
  updatePreferences: (updates: Partial<CoachPreferences>) => {
    set((state) => ({
      preferences: { ...state.preferences, ...updates },
    }));
  },

  // Complete onboarding
  completeOnboarding: () => {
    set((state) => ({
      preferences: { ...state.preferences, onboardingCompleted: true },
      showOnboarding: false,
    }));
  },

  // Add focus area
  addFocusArea: (area: FocusArea) => {
    set((state) => {
      if (state.preferences.focusAreas.includes(area)) return state;
      return {
        preferences: {
          ...state.preferences,
          focusAreas: [...state.preferences.focusAreas, area],
        },
      };
    });
  },

  // Remove focus area
  removeFocusArea: (area: FocusArea) => {
    set((state) => ({
      preferences: {
        ...state.preferences,
        focusAreas: state.preferences.focusAreas.filter((a) => a !== area),
      },
    }));
  },

  // UI actions
  setShowOnboarding: (show: boolean) => {
    set({ showOnboarding: show });
  },

  setShowEmotionLogger: (show: boolean) => {
    set({ showEmotionLogger: show });
  },

  // Load user data from Supabase
  loadUserData: (data) => {
    set({
      conversations: data.conversations,
      emotionalLogs: data.emotionalLogs,
      insights: data.insights,
      preferences: data.preferences,
      showOnboarding: !data.preferences.onboardingCompleted,
    });
  },

  // Get last conversation for sync
  getLastConversation: () => {
    return lastConversation;
  },

  // Get last emotional log for sync
  getLastEmotionalLog: () => {
    return lastEmotionalLog;
  },

  // Get emotion trends for analytics
  getEmotionTrends: (days = 30) => {
    const state = get();
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return state.emotionalLogs.filter((log) => log.loggedAt >= cutoff);
  },

  // Get top triggers
  getTopTriggers: (limit = 5) => {
    const state = get();
    const triggerCounts: Record<string, number> = {};

    state.emotionalLogs.forEach((log) => {
      if (log.trigger) {
        triggerCounts[log.trigger] = (triggerCounts[log.trigger] || 0) + 1;
      }
    });

    return Object.entries(triggerCounts)
      .map(([trigger, count]) => ({ trigger, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },

  // Get conversations by focus area
  getConversationsByFocusArea: (focusArea: FocusArea) => {
    const state = get();
    return state.conversations.filter((c) => c.focusArea === focusArea);
  },
}));

// Helper to format conversation preview
export function getConversationPreview(conversation: Conversation): string {
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  if (!lastMessage) return 'No messages yet';
  return lastMessage.content.slice(0, 100) + (lastMessage.content.length > 100 ? '...' : '');
}

// Helper to get focus area color
export function getFocusAreaColor(focusArea: FocusArea): string {
  const colors: Record<FocusArea, string> = {
    trading: 'cyan',
    fitness: 'green',
    work: 'purple',
    relationships: 'pink',
    general: 'amber',
  };
  return colors[focusArea];
}

// Helper to get emotion color
export function getEmotionColor(emotion: Emotion): string {
  const colors: Record<Emotion, string> = {
    anxious: 'yellow',
    frustrated: 'orange',
    angry: 'red',
    fearful: 'purple',
    sad: 'blue',
    overwhelmed: 'gray',
    calm: 'cyan',
    confident: 'green',
    excited: 'pink',
    content: 'emerald',
    focused: 'indigo',
    neutral: 'slate',
  };
  return colors[emotion];
}
