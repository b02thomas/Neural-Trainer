// ============================================
// AI Psychology Coach Module Types
// ============================================

// Focus areas the coach can specialize in
export type FocusArea = 'trading' | 'fitness' | 'work' | 'relationships' | 'general';

export interface FocusAreaConfig {
  id: FocusArea;
  name: string;
  nameDe: string;
  description: string;
  descriptionDe: string;
  icon: string;  // Lucide icon name
  color: string; // Tailwind color
}

export const FOCUS_AREA_CONFIGS: Record<FocusArea, FocusAreaConfig> = {
  trading: {
    id: 'trading',
    name: 'Trading Psychology',
    nameDe: 'Trading-Psychologie',
    description: 'FOMO, revenge trading, discipline, accepting losses',
    descriptionDe: 'FOMO, Rache-Trading, Disziplin, Verluste akzeptieren',
    icon: 'TrendingUp',
    color: 'cyan',
  },
  fitness: {
    id: 'fitness',
    name: 'Fitness & Health',
    nameDe: 'Fitness & Gesundheit',
    description: 'Exercise motivation, healthy habits, body awareness',
    descriptionDe: 'Trainings-Motivation, gesunde Gewohnheiten, Körperbewusstsein',
    icon: 'Dumbbell',
    color: 'green',
  },
  work: {
    id: 'work',
    name: 'Work & Career',
    nameDe: 'Arbeit & Karriere',
    description: 'Productivity, stress management, professional growth',
    descriptionDe: 'Produktivität, Stressmanagement, berufliches Wachstum',
    icon: 'Briefcase',
    color: 'purple',
  },
  relationships: {
    id: 'relationships',
    name: 'Relationships',
    nameDe: 'Beziehungen',
    description: 'Communication, emotional intelligence, boundaries',
    descriptionDe: 'Kommunikation, emotionale Intelligenz, Grenzen setzen',
    icon: 'Heart',
    color: 'pink',
  },
  general: {
    id: 'general',
    name: 'General Wellness',
    nameDe: 'Allgemeines Wohlbefinden',
    description: 'Mindfulness, thought patterns, self-awareness',
    descriptionDe: 'Achtsamkeit, Denkmuster, Selbstwahrnehmung',
    icon: 'Brain',
    color: 'amber',
  },
};

// Emotions that can be logged
export type Emotion =
  | 'anxious'
  | 'frustrated'
  | 'angry'
  | 'fearful'
  | 'sad'
  | 'overwhelmed'
  | 'calm'
  | 'confident'
  | 'excited'
  | 'content'
  | 'focused'
  | 'neutral';

export interface EmotionConfig {
  id: Emotion;
  name: string;
  nameDe: string;
  color: string;
  isNegative: boolean;
}

export const EMOTION_CONFIGS: Record<Emotion, EmotionConfig> = {
  anxious: { id: 'anxious', name: 'Anxious', nameDe: 'Ängstlich', color: 'yellow', isNegative: true },
  frustrated: { id: 'frustrated', name: 'Frustrated', nameDe: 'Frustriert', color: 'orange', isNegative: true },
  angry: { id: 'angry', name: 'Angry', nameDe: 'Wütend', color: 'red', isNegative: true },
  fearful: { id: 'fearful', name: 'Fearful', nameDe: 'Verängstigt', color: 'purple', isNegative: true },
  sad: { id: 'sad', name: 'Sad', nameDe: 'Traurig', color: 'blue', isNegative: true },
  overwhelmed: { id: 'overwhelmed', name: 'Overwhelmed', nameDe: 'Überfordert', color: 'gray', isNegative: true },
  calm: { id: 'calm', name: 'Calm', nameDe: 'Ruhig', color: 'cyan', isNegative: false },
  confident: { id: 'confident', name: 'Confident', nameDe: 'Selbstbewusst', color: 'green', isNegative: false },
  excited: { id: 'excited', name: 'Excited', nameDe: 'Aufgeregt', color: 'pink', isNegative: false },
  content: { id: 'content', name: 'Content', nameDe: 'Zufrieden', color: 'emerald', isNegative: false },
  focused: { id: 'focused', name: 'Focused', nameDe: 'Fokussiert', color: 'indigo', isNegative: false },
  neutral: { id: 'neutral', name: 'Neutral', nameDe: 'Neutral', color: 'slate', isNegative: false },
};

// Coaching styles
export type CoachingStyle = 'direct' | 'supportive' | 'socratic';

export interface CoachingStyleConfig {
  id: CoachingStyle;
  name: string;
  nameDe: string;
  description: string;
  descriptionDe: string;
}

export const COACHING_STYLE_CONFIGS: Record<CoachingStyle, CoachingStyleConfig> = {
  direct: {
    id: 'direct',
    name: 'Direct',
    nameDe: 'Direkt',
    description: 'Straightforward feedback and clear recommendations',
    descriptionDe: 'Direktes Feedback und klare Empfehlungen',
  },
  supportive: {
    id: 'supportive',
    name: 'Supportive',
    nameDe: 'Unterstützend',
    description: 'Empathetic, encouraging, and validating approach',
    descriptionDe: 'Empathischer, ermutigender und bestätigender Ansatz',
  },
  socratic: {
    id: 'socratic',
    name: 'Socratic',
    nameDe: 'Sokratisch',
    description: 'Guides through questions to help you discover insights',
    descriptionDe: 'Führt durch Fragen um eigene Erkenntnisse zu gewinnen',
  },
};

// Available AI models via OpenRouter
export type AIModel =
  | 'anthropic/claude-3.5-sonnet'
  | 'anthropic/claude-3-opus'
  | 'anthropic/claude-3.5-haiku';

export interface AIModelConfig {
  id: AIModel;
  name: string;
  description: string;
  costTier: 'low' | 'medium' | 'high';
  recommended: boolean;
}

export const AI_MODEL_CONFIGS: Record<AIModel, AIModelConfig> = {
  'anthropic/claude-3.5-sonnet': {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude Sonnet 3.5',
    description: 'Best balance of empathy and insight',
    costTier: 'medium',
    recommended: true,
  },
  'anthropic/claude-3-opus': {
    id: 'anthropic/claude-3-opus',
    name: 'Claude Opus 3',
    description: 'Deepest analysis for complex issues',
    costTier: 'high',
    recommended: false,
  },
  'anthropic/claude-3.5-haiku': {
    id: 'anthropic/claude-3.5-haiku',
    name: 'Claude Haiku 3.5',
    description: 'Quick check-ins and simple prompts',
    costTier: 'low',
    recommended: false,
  },
};

// ============================================
// Message Types
// ============================================

export type MessageRole = 'user' | 'assistant' | 'system';

export interface CoachMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  tokensUsed?: number;
  model?: AIModel;
}

// ============================================
// Conversation Types
// ============================================

export interface Conversation {
  id: string;
  title: string;
  focusArea: FocusArea;
  messages: CoachMessage[];
  createdAt: number;
  updatedAt: number;
}

// ============================================
// Emotional Logging
// ============================================

export interface EmotionalLog {
  id: string;
  emotion: Emotion;
  intensity: number;  // 1-10
  context: FocusArea;
  trigger?: string;
  conversationId?: string;
  notes?: string;
  loggedAt: number;
}

// ============================================
// Pattern Insights
// ============================================

export type PatternType =
  | 'recurring_thought'
  | 'emotional_trigger'
  | 'behavior_pattern'
  | 'improvement';

export interface PatternInsight {
  id: string;
  patternType: PatternType;
  title: string;
  description: string;
  frequency: number;
  firstDetectedAt: number;
  lastDetectedAt: number;
  isAcknowledged: boolean;
}

// ============================================
// User Preferences
// ============================================

export interface CoachPreferences {
  focusAreas: FocusArea[];
  preferredModel: AIModel;
  coachingStyle: CoachingStyle;
  dailyCheckinEnabled: boolean;
  onboardingCompleted: boolean;
  systemPromptAdditions?: string;
}

export const DEFAULT_COACH_PREFERENCES: CoachPreferences = {
  focusAreas: ['trading'],
  preferredModel: 'anthropic/claude-3.5-sonnet',
  coachingStyle: 'supportive',
  dailyCheckinEnabled: false,
  onboardingCompleted: false,
};

// ============================================
// Store State Interface
// ============================================

export interface CoachState {
  // Current conversation
  currentConversation: Conversation | null;
  isLoading: boolean;
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;

  // History
  conversations: Conversation[];
  emotionalLogs: EmotionalLog[];
  insights: PatternInsight[];

  // Preferences
  preferences: CoachPreferences;

  // UI State
  showOnboarding: boolean;
  showEmotionLogger: boolean;
}

// ============================================
// Suggested Prompts
// ============================================

export interface SuggestedPrompt {
  id: string;
  text: string;
  textDe: string;
  focusArea: FocusArea;
}

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  // Trading
  { id: 'sp1', text: 'I just took a big loss and feel like revenge trading', textDe: 'Ich habe gerade einen großen Verlust und fühle den Drang zu Rache-Trading', focusArea: 'trading' },
  { id: 'sp2', text: 'I keep missing good setups because of fear', textDe: 'Ich verpasse gute Setups wegen Angst', focusArea: 'trading' },
  { id: 'sp3', text: 'How do I develop more discipline in trading?', textDe: 'Wie entwickle ich mehr Disziplin beim Trading?', focusArea: 'trading' },
  { id: 'sp4', text: 'I am having FOMO about a trade I missed', textDe: 'Ich habe FOMO wegen eines verpassten Trades', focusArea: 'trading' },

  // Fitness
  { id: 'sp5', text: 'I struggle to stay consistent with my workouts', textDe: 'Ich habe Schwierigkeiten, konsistent zu trainieren', focusArea: 'fitness' },
  { id: 'sp6', text: 'How do I overcome gym anxiety?', textDe: 'Wie überwinde ich meine Angst vor dem Fitnessstudio?', focusArea: 'fitness' },

  // Work
  { id: 'sp7', text: 'I am feeling burned out at work', textDe: 'Ich fühle mich bei der Arbeit ausgebrannt', focusArea: 'work' },
  { id: 'sp8', text: 'How do I deal with imposter syndrome?', textDe: 'Wie gehe ich mit dem Imposter-Syndrom um?', focusArea: 'work' },

  // Relationships
  { id: 'sp9', text: 'I have trouble setting boundaries', textDe: 'Ich habe Schwierigkeiten, Grenzen zu setzen', focusArea: 'relationships' },

  // General
  { id: 'sp10', text: 'I notice I am being too hard on myself', textDe: 'Ich merke, dass ich zu hart zu mir selbst bin', focusArea: 'general' },
  { id: 'sp11', text: 'Help me understand my thought patterns', textDe: 'Hilf mir, meine Denkmuster zu verstehen', focusArea: 'general' },
];

// ============================================
// Analytics Types
// ============================================

export interface EmotionTrend {
  date: string;
  averageIntensity: number;
  dominantEmotion: Emotion;
  logCount: number;
}

export interface TriggerFrequency {
  trigger: string;
  count: number;
  associatedEmotions: Emotion[];
}

export interface CoachAnalytics {
  totalConversations: number;
  totalMessages: number;
  totalEmotionLogs: number;
  averageEmotionalIntensity: number;
  emotionTrends: EmotionTrend[];
  topTriggers: TriggerFrequency[];
  insightCount: number;
  acknowledgedInsights: number;
  sessionsThisWeek: number;
  mostActiveDay: string;
}
