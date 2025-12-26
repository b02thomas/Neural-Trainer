import { create } from 'zustand';
import {
  ResetState,
  ResetStatus,
  ResetType,
  TriggerType,
  ChecklistType,
  TradingRule,
  ChecklistItem,
  ResetSession,
  CooldownSession,
  CooldownDuration,
  DEFAULT_TRADING_RULES,
  DEFAULT_CHECKLIST_ITEMS,
} from '@/types/reset';

interface ResetStore extends ResetState {
  // Session actions
  startAssessment: (trigger?: TriggerType) => void;
  setEmotionalState: (value: number, phase: 'before' | 'after') => void;
  startReset: (type: ResetType) => void;
  completeReset: (notes?: string) => void;
  cancelReset: () => void;

  // Timer updates
  updateElapsed: (ms: number) => void;

  // Grounding exercise actions
  nextGroundingStep: () => void;
  setGroundingResponse: (index: number, response: string) => void;
  resetGrounding: () => void;

  // Grounding questions actions
  nextQuestion: () => void;
  setQuestionAnswer: (questionId: string, answer: string) => void;
  resetQuestions: () => void;

  // Cooldown actions
  startCooldown: (duration: CooldownDuration, reason?: string) => void;
  completeCooldown: () => void;
  cancelCooldown: () => void;
  checkCooldownStatus: () => { isActive: boolean; remainingMs: number };

  // Trading rules actions
  addTradingRule: (rule: Omit<TradingRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTradingRule: (id: string, updates: Partial<TradingRule>) => void;
  deleteTradingRule: (id: string) => void;
  toggleTradingRule: (id: string) => void;
  reorderRules: (ruleIds: string[]) => void;
  initializeDefaultRules: () => void;

  // Checklist actions
  addChecklistItem: (type: ChecklistType, itemText: string) => void;
  updateChecklistItem: (type: ChecklistType, id: string, updates: Partial<ChecklistItem>) => void;
  deleteChecklistItem: (type: ChecklistType, id: string) => void;
  reorderChecklist: (type: ChecklistType, itemIds: string[]) => void;
  initializeDefaultChecklists: () => void;

  // Data sync actions
  loadUserData: (data: {
    rules: TradingRule[];
    checklists: Record<ChecklistType, ChecklistItem[]>;
    sessions: ResetSession[];
    cooldowns: CooldownSession[];
  }) => void;
  getLastSession: () => ResetSession | null;
  getLastCooldown: () => CooldownSession | null;
}

const DEFAULT_STATE: ResetState = {
  // Current session
  status: 'idle',
  currentType: null,
  currentTrigger: null,
  emotionalStateBefore: null,
  emotionalStateAfter: null,

  // Timers
  elapsedMs: 0,
  startTime: null,
  cooldownEndTime: null,

  // Grounding exercise state
  currentGroundingStep: 0,
  groundingResponses: [],

  // Questions state
  currentQuestionIndex: 0,
  questionAnswers: {},

  // User data
  tradingRules: [],
  checklists: {
    pre_trade: [],
    post_loss: [],
    post_win: [],
  },
  recentSessions: [],
  cooldownHistory: [],
};

// Track last completed session for Supabase sync
let lastCompletedSession: ResetSession | null = null;
let lastCompletedCooldown: CooldownSession | null = null;

export const useResetStore = create<ResetStore>()((set, get) => ({
  ...DEFAULT_STATE,

  // Start assessment phase (before choosing intervention)
  startAssessment: (trigger?: TriggerType) => {
    set({
      status: 'assessing',
      currentTrigger: trigger || null,
      emotionalStateBefore: null,
      emotionalStateAfter: null,
    });
  },

  // Set emotional state (before or after intervention)
  setEmotionalState: (value: number, phase: 'before' | 'after') => {
    if (phase === 'before') {
      set({ emotionalStateBefore: value });
    } else {
      set({ emotionalStateAfter: value });
    }
  },

  // Start a specific reset type
  startReset: (type: ResetType) => {
    set({
      status: 'active',
      currentType: type,
      elapsedMs: 0,
      startTime: performance.now(),
      currentGroundingStep: 0,
      groundingResponses: [],
      currentQuestionIndex: 0,
      questionAnswers: {},
    });
  },

  // Complete the reset session
  completeReset: (notes?: string) => {
    const state = get();
    if (!state.currentType) return;

    const session: ResetSession = {
      id: crypto.randomUUID(),
      type: state.currentType,
      trigger: state.currentTrigger || undefined,
      durationSeconds: Math.round(state.elapsedMs / 1000),
      emotionalStateBefore: state.emotionalStateBefore || undefined,
      emotionalStateAfter: state.emotionalStateAfter || undefined,
      notes,
      completedAt: Date.now(),
    };

    lastCompletedSession = session;

    set({
      status: 'completed',
      recentSessions: [...state.recentSessions.slice(-99), session],
    });
  },

  // Cancel the reset session
  cancelReset: () => {
    set({
      status: 'idle',
      currentType: null,
      currentTrigger: null,
      elapsedMs: 0,
      startTime: null,
      emotionalStateBefore: null,
      emotionalStateAfter: null,
    });
  },

  // Update elapsed time
  updateElapsed: (ms: number) => {
    set({ elapsedMs: ms });
  },

  // Grounding exercise actions
  nextGroundingStep: () => {
    set((state) => ({
      currentGroundingStep: Math.min(state.currentGroundingStep + 1, 4),
    }));
  },

  setGroundingResponse: (index: number, response: string) => {
    set((state) => {
      const responses = [...state.groundingResponses];
      responses[index] = response;
      return { groundingResponses: responses };
    });
  },

  resetGrounding: () => {
    set({
      currentGroundingStep: 0,
      groundingResponses: [],
    });
  },

  // Grounding questions actions
  nextQuestion: () => {
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
    }));
  },

  setQuestionAnswer: (questionId: string, answer: string) => {
    set((state) => ({
      questionAnswers: {
        ...state.questionAnswers,
        [questionId]: answer,
      },
    }));
  },

  resetQuestions: () => {
    set({
      currentQuestionIndex: 0,
      questionAnswers: {},
    });
  },

  // Cooldown actions
  startCooldown: (duration: CooldownDuration, reason?: string) => {
    const endTime = Date.now() + duration * 60 * 1000;
    set({
      status: 'cooldown',
      cooldownEndTime: endTime,
    });

    // Track cooldown session
    const cooldown: CooldownSession = {
      id: crypto.randomUUID(),
      reason,
      durationMinutes: duration,
      startedAt: Date.now(),
      wasCompleted: false,
    };

    set((state) => ({
      cooldownHistory: [...state.cooldownHistory.slice(-99), cooldown],
    }));
  },

  completeCooldown: () => {
    const state = get();
    const lastCooldown = state.cooldownHistory[state.cooldownHistory.length - 1];

    if (lastCooldown && !lastCooldown.wasCompleted) {
      const updatedCooldown = {
        ...lastCooldown,
        completedAt: Date.now(),
        wasCompleted: true,
      };
      lastCompletedCooldown = updatedCooldown;

      set({
        status: 'completed',
        cooldownEndTime: null,
        cooldownHistory: [
          ...state.cooldownHistory.slice(0, -1),
          updatedCooldown,
        ],
      });
    }
  },

  cancelCooldown: () => {
    const state = get();
    const lastCooldown = state.cooldownHistory[state.cooldownHistory.length - 1];

    if (lastCooldown && !lastCooldown.wasCompleted) {
      const updatedCooldown = {
        ...lastCooldown,
        completedAt: Date.now(),
        wasCompleted: false,
      };
      lastCompletedCooldown = updatedCooldown;

      set({
        status: 'idle',
        cooldownEndTime: null,
        cooldownHistory: [
          ...state.cooldownHistory.slice(0, -1),
          updatedCooldown,
        ],
      });
    }
  },

  checkCooldownStatus: () => {
    const state = get();
    if (!state.cooldownEndTime) {
      return { isActive: false, remainingMs: 0 };
    }

    const remainingMs = state.cooldownEndTime - Date.now();
    if (remainingMs <= 0) {
      return { isActive: false, remainingMs: 0 };
    }

    return { isActive: true, remainingMs };
  },

  // Trading rules actions
  addTradingRule: (rule) => {
    const newRule: TradingRule = {
      ...rule,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set((state) => ({
      tradingRules: [...state.tradingRules, newRule],
    }));
  },

  updateTradingRule: (id: string, updates: Partial<TradingRule>) => {
    set((state) => ({
      tradingRules: state.tradingRules.map((rule) =>
        rule.id === id
          ? { ...rule, ...updates, updatedAt: Date.now() }
          : rule
      ),
    }));
  },

  deleteTradingRule: (id: string) => {
    set((state) => ({
      tradingRules: state.tradingRules.filter((rule) => rule.id !== id),
    }));
  },

  toggleTradingRule: (id: string) => {
    set((state) => ({
      tradingRules: state.tradingRules.map((rule) =>
        rule.id === id
          ? { ...rule, isActive: !rule.isActive, updatedAt: Date.now() }
          : rule
      ),
    }));
  },

  reorderRules: (ruleIds: string[]) => {
    set((state) => {
      const ruleMap = new Map(state.tradingRules.map((r) => [r.id, r]));
      const reordered = ruleIds
        .map((id, index) => {
          const rule = ruleMap.get(id);
          return rule ? { ...rule, priority: index } : null;
        })
        .filter((r): r is TradingRule => r !== null);

      return { tradingRules: reordered };
    });
  },

  initializeDefaultRules: () => {
    const state = get();
    if (state.tradingRules.length === 0) {
      const rules: TradingRule[] = DEFAULT_TRADING_RULES.map((r, index) => ({
        ...r,
        id: crypto.randomUUID(),
        priority: index,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));
      set({ tradingRules: rules });
    }
  },

  // Checklist actions
  addChecklistItem: (type: ChecklistType, itemText: string) => {
    set((state) => {
      const items = state.checklists[type];
      const newItem: ChecklistItem = {
        id: crypto.randomUUID(),
        itemText,
        orderIndex: items.length,
        isActive: true,
      };

      return {
        checklists: {
          ...state.checklists,
          [type]: [...items, newItem],
        },
      };
    });
  },

  updateChecklistItem: (type: ChecklistType, id: string, updates: Partial<ChecklistItem>) => {
    set((state) => ({
      checklists: {
        ...state.checklists,
        [type]: state.checklists[type].map((item) =>
          item.id === id ? { ...item, ...updates } : item
        ),
      },
    }));
  },

  deleteChecklistItem: (type: ChecklistType, id: string) => {
    set((state) => ({
      checklists: {
        ...state.checklists,
        [type]: state.checklists[type].filter((item) => item.id !== id),
      },
    }));
  },

  reorderChecklist: (type: ChecklistType, itemIds: string[]) => {
    set((state) => {
      const itemMap = new Map(state.checklists[type].map((i) => [i.id, i]));
      const reordered = itemIds
        .map((id, index) => {
          const item = itemMap.get(id);
          return item ? { ...item, orderIndex: index } : null;
        })
        .filter((i): i is ChecklistItem => i !== null);

      return {
        checklists: {
          ...state.checklists,
          [type]: reordered,
        },
      };
    });
  },

  initializeDefaultChecklists: () => {
    const state = get();
    const hasNoItems = Object.values(state.checklists).every(
      (items) => items.length === 0
    );

    if (hasNoItems) {
      const checklists: Record<ChecklistType, ChecklistItem[]> = {
        pre_trade: DEFAULT_CHECKLIST_ITEMS.pre_trade.map((item) => ({
          ...item,
          id: crypto.randomUUID(),
        })),
        post_loss: DEFAULT_CHECKLIST_ITEMS.post_loss.map((item) => ({
          ...item,
          id: crypto.randomUUID(),
        })),
        post_win: DEFAULT_CHECKLIST_ITEMS.post_win.map((item) => ({
          ...item,
          id: crypto.randomUUID(),
        })),
      };
      set({ checklists });
    }
  },

  // Data sync actions
  loadUserData: (data) => {
    set({
      tradingRules: data.rules,
      checklists: data.checklists,
      recentSessions: data.sessions,
      cooldownHistory: data.cooldowns,
    });
  },

  getLastSession: () => {
    return lastCompletedSession;
  },

  getLastCooldown: () => {
    return lastCompletedCooldown;
  },
}));

// Helper to format cooldown time remaining
export function formatCooldownTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Helper to get reset type display name
export function getResetTypeDisplayName(type: ResetType): string {
  const names: Record<ResetType, string> = {
    grounding_sensory: '5-4-3-2-1 Grounding',
    grounding_questions: 'Awareness Questions',
    breathing_quick: 'Quick Breathing',
    physical_reset: 'Physical Reset',
    perspective_shift: 'Perspective Shift',
    checklist: 'Checklist',
    cooldown: 'Cooldown Timer',
  };
  return names[type];
}

// Helper to get trigger display name
export function getTriggerDisplayName(trigger: TriggerType): string {
  const names: Record<TriggerType, string> = {
    loss: 'Loss',
    missed_trade: 'Missed Trade',
    fomo: 'FOMO',
    revenge_trading: 'Revenge Trading',
    overtrading: 'Overtrading',
    frustration: 'Frustration',
    anxiety: 'Anxiety',
    manual: 'Manual Reset',
  };
  return names[trigger];
}
