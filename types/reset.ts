// ============================================
// Trader Reset/Recovery Module Types
// ============================================

// Reset intervention types
export type ResetType =
  | 'grounding_sensory'      // 5-4-3-2-1 sensory grounding
  | 'grounding_questions'    // Awareness questions
  | 'breathing_quick'        // Quick 5 breaths
  | 'physical_reset'         // Stretch/eye break
  | 'perspective_shift'      // Time perspective prompts
  | 'checklist'              // Pre-trade / post-loss checklist
  | 'cooldown';              // Forced break timer

// What triggered the need for reset
export type TriggerType =
  | 'loss'
  | 'missed_trade'
  | 'fomo'
  | 'revenge_trading'
  | 'overtrading'
  | 'frustration'
  | 'anxiety'
  | 'manual';

// Checklist types
export type ChecklistType = 'pre_trade' | 'post_loss' | 'post_win';

// Trading rule categories
export type RuleCategory = 'entry' | 'exit' | 'risk' | 'emotional' | 'general';

// Reset session status
export type ResetStatus = 'idle' | 'assessing' | 'active' | 'cooldown' | 'completed';

// Cooldown duration options in minutes
export type CooldownDuration = 5 | 15 | 30 | 60;
export const COOLDOWN_DURATIONS: CooldownDuration[] = [5, 15, 30, 60];

// ============================================
// Grounding Exercise Types
// ============================================

// 5-4-3-2-1 grounding steps
export type GroundingStep = 'see' | 'touch' | 'hear' | 'smell' | 'taste';

export interface GroundingStepConfig {
  step: GroundingStep;
  count: number;
  prompt: string;
  promptDe: string;
  icon: string;  // Lucide icon name
}

export const GROUNDING_STEPS: GroundingStepConfig[] = [
  { step: 'see', count: 5, prompt: 'Name 5 things you can see', promptDe: 'Nenne 5 Dinge die du siehst', icon: 'Eye' },
  { step: 'touch', count: 4, prompt: 'Name 4 things you can touch', promptDe: 'Nenne 4 Dinge die du berühren kannst', icon: 'Hand' },
  { step: 'hear', count: 3, prompt: 'Name 3 things you can hear', promptDe: 'Nenne 3 Dinge die du hörst', icon: 'Ear' },
  { step: 'smell', count: 2, prompt: 'Name 2 things you can smell', promptDe: 'Nenne 2 Dinge die du riechst', icon: 'Wind' },
  { step: 'taste', count: 1, prompt: 'Name 1 thing you can taste', promptDe: 'Nenne 1 Ding das du schmeckst', icon: 'Utensils' },
];

// ============================================
// Grounding Questions
// ============================================

export type QuestionCategory = 'awareness' | 'plan_check' | 'emotional' | 'perspective';

export interface GroundingQuestion {
  id: string;
  question: string;
  questionDe: string;
  category: QuestionCategory;
}

export const GROUNDING_QUESTIONS: GroundingQuestion[] = [
  { id: 'q1', question: 'What is my trading plan for today?', questionDe: 'Was ist mein Handelsplan für heute?', category: 'plan_check' },
  { id: 'q2', question: 'Am I following my rules right now?', questionDe: 'Folge ich gerade meinen Regeln?', category: 'plan_check' },
  { id: 'q3', question: 'Is this revenge trading?', questionDe: 'Ist das Rache-Trading?', category: 'emotional' },
  { id: 'q4', question: 'Am I trading from fear or greed?', questionDe: 'Handle ich aus Angst oder Gier?', category: 'emotional' },
  { id: 'q5', question: 'What is the risk on this trade?', questionDe: 'Was ist das Risiko bei diesem Trade?', category: 'plan_check' },
  { id: 'q6', question: 'Can I afford to lose this amount?', questionDe: 'Kann ich mir leisten, diesen Betrag zu verlieren?', category: 'awareness' },
  { id: 'q7', question: 'Am I emotionally stable right now?', questionDe: 'Bin ich gerade emotional stabil?', category: 'emotional' },
  { id: 'q8', question: 'Would I take this trade again tomorrow?', questionDe: 'Würde ich diesen Trade morgen wieder machen?', category: 'perspective' },
  { id: 'q9', question: 'What would my mentor say about this?', questionDe: 'Was würde mein Mentor dazu sagen?', category: 'perspective' },
  { id: 'q10', question: 'Is this a high-probability setup?', questionDe: 'Ist das ein Setup mit hoher Wahrscheinlichkeit?', category: 'plan_check' },
];

// ============================================
// Perspective Shift Prompts
// ============================================

export interface PerspectivePrompt {
  id: string;
  prompt: string;
  promptDe: string;
  timeframe: 'week' | 'month' | 'year' | 'life';
}

export const PERSPECTIVE_PROMPTS: PerspectivePrompt[] = [
  { id: 'p1', prompt: 'Will this loss matter in a week?', promptDe: 'Wird dieser Verlust in einer Woche noch wichtig sein?', timeframe: 'week' },
  { id: 'p2', prompt: 'Will this matter in a month?', promptDe: 'Wird das in einem Monat noch wichtig sein?', timeframe: 'month' },
  { id: 'p3', prompt: 'Will this matter in a year?', promptDe: 'Wird das in einem Jahr noch wichtig sein?', timeframe: 'year' },
  { id: 'p4', prompt: 'This is one trade out of thousands in your career', promptDe: 'Das ist ein Trade von tausenden in deiner Karriere', timeframe: 'life' },
  { id: 'p5', prompt: 'Every successful trader has lost more than you today', promptDe: 'Jeder erfolgreiche Trader hat mehr verloren als du heute', timeframe: 'life' },
  { id: 'p6', prompt: 'The market will be here tomorrow', promptDe: 'Der Markt wird morgen noch da sein', timeframe: 'week' },
];

// ============================================
// Physical Reset Prompts
// ============================================

export type PhysicalResetType = 'eye_break' | 'stretch' | 'breathing' | 'hydrate' | 'walk';

export interface PhysicalResetPrompt {
  id: string;
  type: PhysicalResetType;
  prompt: string;
  promptDe: string;
  durationSeconds: number;
  icon: string;
}

export const PHYSICAL_RESET_PROMPTS: PhysicalResetPrompt[] = [
  { id: 'pr1', type: 'eye_break', prompt: 'Look at something 20 feet away for 20 seconds', promptDe: 'Schaue 20 Sekunden auf etwas in 6m Entfernung', durationSeconds: 20, icon: 'Eye' },
  { id: 'pr2', type: 'stretch', prompt: 'Roll your shoulders back 5 times', promptDe: 'Rolle deine Schultern 5 mal nach hinten', durationSeconds: 15, icon: 'Dumbbell' },
  { id: 'pr3', type: 'stretch', prompt: 'Stretch your neck gently to each side', promptDe: 'Dehne deinen Nacken sanft zu jeder Seite', durationSeconds: 20, icon: 'Activity' },
  { id: 'pr4', type: 'hydrate', prompt: 'Take a drink of water', promptDe: 'Trinke einen Schluck Wasser', durationSeconds: 10, icon: 'Droplets' },
  { id: 'pr5', type: 'walk', prompt: 'Stand up and take 10 steps', promptDe: 'Stehe auf und gehe 10 Schritte', durationSeconds: 30, icon: 'Footprints' },
];

// ============================================
// Trading Rules
// ============================================

export interface TradingRule {
  id: string;
  ruleText: string;
  category: RuleCategory;
  priority: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

// Default trading rules (suggestions for new users)
export const DEFAULT_TRADING_RULES: Omit<TradingRule, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { ruleText: 'Never risk more than 1% per trade', category: 'risk', priority: 1, isActive: true },
  { ruleText: 'Always set a stop loss before entering', category: 'entry', priority: 2, isActive: true },
  { ruleText: 'No trading when emotionally upset', category: 'emotional', priority: 3, isActive: true },
  { ruleText: 'Maximum 3 losing trades per day', category: 'risk', priority: 4, isActive: true },
  { ruleText: 'Take a break after every 2 hours', category: 'emotional', priority: 5, isActive: true },
];

// ============================================
// Checklists
// ============================================

export interface ChecklistItem {
  id: string;
  itemText: string;
  orderIndex: number;
  isActive: boolean;
}

// Default checklist items
export const DEFAULT_CHECKLIST_ITEMS: Record<ChecklistType, Omit<ChecklistItem, 'id'>[]> = {
  pre_trade: [
    { itemText: 'Market conditions align with my strategy', orderIndex: 0, isActive: true },
    { itemText: 'I have identified entry, stop loss, and target', orderIndex: 1, isActive: true },
    { itemText: 'Risk/reward is at least 1:2', orderIndex: 2, isActive: true },
    { itemText: 'I am emotionally stable and focused', orderIndex: 3, isActive: true },
    { itemText: 'No major news events pending', orderIndex: 4, isActive: true },
  ],
  post_loss: [
    { itemText: 'I accept this loss as part of trading', orderIndex: 0, isActive: true },
    { itemText: 'I followed my trading plan', orderIndex: 1, isActive: true },
    { itemText: 'I am not feeling urge to revenge trade', orderIndex: 2, isActive: true },
    { itemText: 'I have reviewed what I can learn', orderIndex: 3, isActive: true },
    { itemText: 'I am ready to wait for next quality setup', orderIndex: 4, isActive: true },
  ],
  post_win: [
    { itemText: 'I followed my trading plan', orderIndex: 0, isActive: true },
    { itemText: 'I am not feeling overconfident', orderIndex: 1, isActive: true },
    { itemText: 'I will not increase position size impulsively', orderIndex: 2, isActive: true },
    { itemText: 'I recognize this win may be luck', orderIndex: 3, isActive: true },
  ],
};

// ============================================
// Session Types
// ============================================

export interface ResetSession {
  id: string;
  type: ResetType;
  trigger?: TriggerType;
  durationSeconds: number;
  emotionalStateBefore?: number;  // 1-10
  emotionalStateAfter?: number;   // 1-10
  notes?: string;
  completedAt: number;
}

export interface ChecklistCompletion {
  id: string;
  checklistType: ChecklistType;
  itemsChecked: Array<{ id: string; checked: boolean; text: string }>;
  notes?: string;
  completedAt: number;
}

export interface CooldownSession {
  id: string;
  reason?: string;
  durationMinutes: CooldownDuration;
  startedAt: number;
  completedAt?: number;
  wasCompleted: boolean;
}

// ============================================
// Store State Interface
// ============================================

export interface ResetState {
  // Current session
  status: ResetStatus;
  currentType: ResetType | null;
  currentTrigger: TriggerType | null;
  emotionalStateBefore: number | null;
  emotionalStateAfter: number | null;

  // Timers
  elapsedMs: number;
  startTime: number | null;
  cooldownEndTime: number | null;

  // Grounding exercise state
  currentGroundingStep: number;  // 0-4 for 5-4-3-2-1
  groundingResponses: string[];

  // Questions state
  currentQuestionIndex: number;
  questionAnswers: Record<string, string>;

  // User data
  tradingRules: TradingRule[];
  checklists: Record<ChecklistType, ChecklistItem[]>;
  recentSessions: ResetSession[];
  cooldownHistory: CooldownSession[];
}

// ============================================
// Statistics
// ============================================

export interface ResetStatistics {
  totalSessions: number;
  sessionsThisWeek: number;
  mostUsedType: ResetType | null;
  mostCommonTrigger: TriggerType | null;
  averageEmotionalImprovement: number;  // Difference between after and before
  cooldownsCompleted: number;
  cooldownsAbandoned: number;
  checklistCompletions: number;
}
