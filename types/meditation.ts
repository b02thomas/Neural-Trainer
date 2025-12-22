// ============================================
// Meditation Module Types
// ============================================

// Breathing pattern types
export type BreathingPatternName = '4-4-4-4' | '4-7-8';

export interface BreathingPattern {
  name: string;
  inhale: number;      // seconds
  holdIn: number;      // seconds
  exhale: number;      // seconds
  holdOut: number;     // seconds
}

export const BREATHING_PATTERNS: Record<BreathingPatternName, BreathingPattern> = {
  '4-4-4-4': {
    name: 'Box Breathing',
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
  },
  '4-7-8': {
    name: 'Relaxing Breath',
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
  },
};

// Breathing phases
export type BreathingPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

export interface PhaseConfig {
  color: string;
  tailwindColor: string;
  prompt: string;
  promptDe: string;
}

export const PHASE_CONFIGS: Record<BreathingPhase, PhaseConfig> = {
  'inhale': {
    color: '#22D3EE',     // cyan-400
    tailwindColor: 'cyan',
    prompt: 'Breathe in slowly',
    promptDe: 'Langsam einatmen',
  },
  'hold-in': {
    color: '#A855F7',     // purple-500
    tailwindColor: 'purple',
    prompt: 'Hold your breath',
    promptDe: 'Atem anhalten',
  },
  'exhale': {
    color: '#22C55E',     // green-500
    tailwindColor: 'green',
    prompt: 'Breathe out slowly',
    promptDe: 'Langsam ausatmen',
  },
  'hold-out': {
    color: '#F59E0B',     // amber-500
    tailwindColor: 'amber',
    prompt: 'Rest empty',
    promptDe: 'Leer ruhen',
  },
};

// Body-Scan regions (15 zones)
export type BodyRegion =
  | 'feet'
  | 'lower-legs'
  | 'upper-legs'
  | 'pelvis'
  | 'abdomen'
  | 'chest'
  | 'lower-back'
  | 'upper-back'
  | 'hands'
  | 'forearms'
  | 'upper-arms'
  | 'shoulders'
  | 'neck'
  | 'face'
  | 'head';

export interface BodyRegionConfig {
  name: string;
  nameDe: string;
  prompt: string;
  promptDe: string;
  svgPath?: string;  // Optional SVG highlight path
}

export const BODY_REGIONS: BodyRegion[] = [
  'feet',
  'lower-legs',
  'upper-legs',
  'pelvis',
  'abdomen',
  'chest',
  'lower-back',
  'upper-back',
  'hands',
  'forearms',
  'upper-arms',
  'shoulders',
  'neck',
  'face',
  'head',
];

export const BODY_REGION_CONFIGS: Record<BodyRegion, BodyRegionConfig> = {
  'feet': {
    name: 'Feet',
    nameDe: 'Füße',
    prompt: 'Notice any sensations in your feet',
    promptDe: 'Spüre die Empfindungen in deinen Füßen',
  },
  'lower-legs': {
    name: 'Lower Legs',
    nameDe: 'Unterschenkel',
    prompt: 'Feel the weight and warmth in your calves',
    promptDe: 'Spüre das Gewicht und die Wärme in deinen Waden',
  },
  'upper-legs': {
    name: 'Upper Legs',
    nameDe: 'Oberschenkel',
    prompt: 'Relax your thighs completely',
    promptDe: 'Entspanne deine Oberschenkel vollständig',
  },
  'pelvis': {
    name: 'Pelvis',
    nameDe: 'Becken',
    prompt: 'Let go of any tension in your hips',
    promptDe: 'Lass jede Anspannung in deiner Hüfte los',
  },
  'abdomen': {
    name: 'Abdomen',
    nameDe: 'Bauch',
    prompt: 'Feel your belly rise and fall',
    promptDe: 'Spüre wie dein Bauch sich hebt und senkt',
  },
  'chest': {
    name: 'Chest',
    nameDe: 'Brust',
    prompt: 'Notice your heartbeat and breath',
    promptDe: 'Nimm deinen Herzschlag und Atem wahr',
  },
  'lower-back': {
    name: 'Lower Back',
    nameDe: 'Unterer Rücken',
    prompt: 'Release tension from your lower spine',
    promptDe: 'Löse Anspannung im unteren Rücken',
  },
  'upper-back': {
    name: 'Upper Back',
    nameDe: 'Oberer Rücken',
    prompt: 'Soften the muscles between your shoulder blades',
    promptDe: 'Entspanne die Muskeln zwischen den Schulterblättern',
  },
  'hands': {
    name: 'Hands',
    nameDe: 'Hände',
    prompt: 'Feel any tingling or warmth in your hands',
    promptDe: 'Spüre Kribbeln oder Wärme in deinen Händen',
  },
  'forearms': {
    name: 'Forearms',
    nameDe: 'Unterarme',
    prompt: 'Let your forearms feel heavy and relaxed',
    promptDe: 'Lass deine Unterarme schwer und entspannt werden',
  },
  'upper-arms': {
    name: 'Upper Arms',
    nameDe: 'Oberarme',
    prompt: 'Release any holding in your biceps',
    promptDe: 'Löse jede Anspannung in deinen Oberarmen',
  },
  'shoulders': {
    name: 'Shoulders',
    nameDe: 'Schultern',
    prompt: 'Let your shoulders drop away from your ears',
    promptDe: 'Lass deine Schultern von den Ohren weg sinken',
  },
  'neck': {
    name: 'Neck',
    nameDe: 'Nacken',
    prompt: 'Soften the muscles of your neck',
    promptDe: 'Entspanne die Muskeln deines Nackens',
  },
  'face': {
    name: 'Face',
    nameDe: 'Gesicht',
    prompt: 'Relax your jaw, eyes, and forehead',
    promptDe: 'Entspanne Kiefer, Augen und Stirn',
  },
  'head': {
    name: 'Head',
    nameDe: 'Kopf',
    prompt: 'Feel a sense of spaciousness in your mind',
    promptDe: 'Spüre eine Weite in deinem Geist',
  },
};

// Session durations in minutes
export type SessionDuration = 2 | 5 | 10 | 15 | 20;
export const SESSION_DURATIONS: SessionDuration[] = [2, 5, 10, 15, 20];

// Meditation types
export type MeditationType = 'breathing' | 'body-scan' | 'open-monitoring';

// Session status
export type MeditationStatus = 'idle' | 'countdown' | 'active' | 'paused' | 'completed';

// Open Monitoring chime intervals in seconds
export type ChimeInterval = 30 | 60 | 120 | 0;  // 0 = no chimes
export const CHIME_INTERVALS: ChimeInterval[] = [0, 30, 60, 120];

// Binaural beats brainwave types
export type BrainwaveType = 'alpha' | 'theta' | 'off';

export interface BrainwaveConfig {
  name: string;
  nameDe: string;
  beatFrequency: number;  // Hz - the perceived frequency difference
  baseFrequency: number;  // Hz - carrier frequency for left ear
  description: string;
  descriptionDe: string;
}

export const BRAINWAVE_CONFIGS: Record<Exclude<BrainwaveType, 'off'>, BrainwaveConfig> = {
  'alpha': {
    name: 'Alpha Waves',
    nameDe: 'Alpha-Wellen',
    beatFrequency: 10,     // 10 Hz alpha
    baseFrequency: 200,    // Left ear: 200 Hz, Right ear: 210 Hz
    description: 'Relaxed alertness, calm focus',
    descriptionDe: 'Entspannte Wachheit, ruhiger Fokus',
  },
  'theta': {
    name: 'Theta Waves',
    nameDe: 'Theta-Wellen',
    beatFrequency: 6,      // 6 Hz theta
    baseFrequency: 200,    // Left ear: 200 Hz, Right ear: 206 Hz
    description: 'Deep meditation, creativity',
    descriptionDe: 'Tiefe Meditation, Kreativität',
  },
};

// Completed session record
export interface MeditationSession {
  id: string;
  type: MeditationType;
  duration: SessionDuration;
  completedAt: number;         // timestamp
  actualDurationMs: number;    // actual time in ms

  // Breathing specific
  breathingPattern?: BreathingPatternName;
  cyclesCompleted?: number;

  // Body-Scan specific
  regionsCompleted?: number;

  // Open Monitoring specific
  thoughtsNoticed?: number;

  // Binaural beats
  brainwaveType?: BrainwaveType;
}

// Meditation state interface (for store)
export interface MeditationState {
  status: MeditationStatus;
  currentType: MeditationType | null;
  targetDuration: SessionDuration;
  elapsedMs: number;
  startTime: number | null;

  // Breathing state
  breathingPattern: BreathingPatternName;
  currentPhase: BreathingPhase;
  phaseProgress: number;       // 0-1 progress within current phase
  cycleCount: number;

  // Body-Scan state
  currentRegionIndex: number;
  regionProgress: number;      // 0-1 progress within current region

  // Open Monitoring state
  thoughtTapCount: number;
  chimeInterval: ChimeInterval;
  lastChimeTime: number | null;

  // Binaural beats state
  selectedBrainwave: BrainwaveType;

  // Session history
  sessions: MeditationSession[];
}

// Session statistics
export interface MeditationStatistics {
  totalSessions: number;
  totalMinutes: number;
  sessionsThisWeek: number;
  minutesThisWeek: number;
  longestStreak: number;       // consecutive days
  currentStreak: number;
  averageSessionLength: number;
  favoriteType: MeditationType | null;

  // Type-specific stats
  breathingSessions: number;
  bodyScanSessions: number;
  openMonitoringSessions: number;

  // Open Monitoring specific
  averageThoughtsPerSession: number;
}
