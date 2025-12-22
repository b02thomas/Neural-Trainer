import { create } from 'zustand';
import {
  MeditationState,
  MeditationStatus,
  MeditationType,
  SessionDuration,
  BreathingPatternName,
  BreathingPhase,
  ChimeInterval,
  BrainwaveType,
  MeditationSession,
  BREATHING_PATTERNS,
} from '@/types/meditation';

interface MeditationStore extends MeditationState {
  // Actions
  startSession: (type: MeditationType, duration: SessionDuration) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => void;
  completeSession: () => void;

  // Breathing actions
  setBreathingPattern: (pattern: BreathingPatternName) => void;
  setPhase: (phase: BreathingPhase) => void;
  setPhaseProgress: (progress: number) => void;
  incrementCycle: () => void;

  // Body-Scan actions
  nextRegion: () => void;
  setRegionProgress: (progress: number) => void;

  // Open Monitoring actions
  tapThought: () => void;
  setChimeInterval: (interval: ChimeInterval) => void;
  recordChime: () => void;

  // Binaural beats actions
  setBrainwave: (type: BrainwaveType) => void;

  // Timer updates
  updateElapsed: (ms: number) => void;

  // Settings
  setTargetDuration: (duration: SessionDuration) => void;

  // Reset
  resetSession: () => void;

  // Data sync actions (for Supabase integration)
  loadHistoricalData: (sessions: MeditationSession[]) => void;
  loadPreferences: (prefs: {
    targetDuration: SessionDuration;
    breathingPattern: BreathingPatternName;
    chimeInterval: ChimeInterval;
    selectedBrainwave: BrainwaveType;
  }) => void;
  getLastSession: () => MeditationSession | null;
}

const DEFAULT_STATE: MeditationState = {
  status: 'idle',
  currentType: null,
  targetDuration: 5,
  elapsedMs: 0,
  startTime: null,

  // Breathing
  breathingPattern: '4-4-4-4',
  currentPhase: 'inhale',
  phaseProgress: 0,
  cycleCount: 0,

  // Body-Scan
  currentRegionIndex: 0,
  regionProgress: 0,

  // Open Monitoring
  thoughtTapCount: 0,
  chimeInterval: 60,
  lastChimeTime: null,

  // Binaural beats
  selectedBrainwave: 'off',

  // History
  sessions: [],
};

// Track last completed session for easy retrieval (for saving to Supabase)
let lastCompletedSession: MeditationSession | null = null;

export const useMeditationStore = create<MeditationStore>()((set, get) => ({
  ...DEFAULT_STATE,

  // Start a meditation session
  startSession: (type: MeditationType, duration: SessionDuration) => {
        set({
          status: 'countdown',
          currentType: type,
          targetDuration: duration,
          elapsedMs: 0,
          startTime: null,
          currentPhase: 'inhale',
          phaseProgress: 0,
          cycleCount: 0,
          currentRegionIndex: 0,
          regionProgress: 0,
          thoughtTapCount: 0,
          lastChimeTime: null,
        });

        // After countdown (3 seconds), start the active session
        setTimeout(() => {
          set({
            status: 'active',
            startTime: performance.now(),
          });
        }, 3000);
      },

      // Pause session
      pauseSession: () => {
        const state = get();
        if (state.status === 'active') {
          set({ status: 'paused' });
        }
      },

      // Resume session
      resumeSession: () => {
        const state = get();
        if (state.status === 'paused') {
          set({
            status: 'active',
            startTime: performance.now() - state.elapsedMs,
          });
        }
      },

      // Stop session (cancel without saving)
      stopSession: () => {
        set({
          status: 'idle',
          currentType: null,
          elapsedMs: 0,
          startTime: null,
        });
      },

      // Complete session and save to history
      completeSession: () => {
        const state = get();
        if (!state.currentType) return;

        const session: MeditationSession = {
          id: crypto.randomUUID(),
          type: state.currentType,
          duration: state.targetDuration,
          completedAt: Date.now(),
          actualDurationMs: state.elapsedMs,
        };

        // Add type-specific data
        if (state.currentType === 'breathing') {
          session.breathingPattern = state.breathingPattern;
          session.cyclesCompleted = state.cycleCount;
        } else if (state.currentType === 'body-scan') {
          session.regionsCompleted = state.currentRegionIndex + 1;
        } else if (state.currentType === 'open-monitoring') {
          session.thoughtsNoticed = state.thoughtTapCount;
        }

        // Add brainwave type if used
        if (state.selectedBrainwave !== 'off') {
          session.brainwaveType = state.selectedBrainwave;
        }

        // Store for Supabase sync
        lastCompletedSession = session;

        set({
          status: 'completed',
          sessions: [...state.sessions.slice(-99), session], // Keep last 100 sessions
        });
      },

      // Breathing actions
      setBreathingPattern: (pattern: BreathingPatternName) => {
        set({ breathingPattern: pattern });
      },

      setPhase: (phase: BreathingPhase) => {
        set({ currentPhase: phase, phaseProgress: 0 });
      },

      setPhaseProgress: (progress: number) => {
        set({ phaseProgress: Math.min(1, Math.max(0, progress)) });
      },

      incrementCycle: () => {
        set((state) => ({ cycleCount: state.cycleCount + 1 }));
      },

      // Body-Scan actions
      nextRegion: () => {
        set((state) => ({
          currentRegionIndex: state.currentRegionIndex + 1,
          regionProgress: 0,
        }));
      },

      setRegionProgress: (progress: number) => {
        set({ regionProgress: Math.min(1, Math.max(0, progress)) });
      },

      // Open Monitoring actions
      tapThought: () => {
        set((state) => ({ thoughtTapCount: state.thoughtTapCount + 1 }));
      },

      setChimeInterval: (interval: ChimeInterval) => {
        set({ chimeInterval: interval });
      },

      recordChime: () => {
        set({ lastChimeTime: Date.now() });
      },

      // Binaural beats action
      setBrainwave: (type: BrainwaveType) => {
        set({ selectedBrainwave: type });
      },

      // Timer updates
      updateElapsed: (ms: number) => {
        set({ elapsedMs: ms });
      },

      // Settings
      setTargetDuration: (duration: SessionDuration) => {
        set({ targetDuration: duration });
      },

      // Reset to idle
      resetSession: () => {
        set({
          status: 'idle',
          currentType: null,
          elapsedMs: 0,
          startTime: null,
          currentPhase: 'inhale',
          phaseProgress: 0,
          cycleCount: 0,
          currentRegionIndex: 0,
          regionProgress: 0,
          thoughtTapCount: 0,
          lastChimeTime: null,
        });
      },

      // Load historical sessions from Supabase
      loadHistoricalData: (sessions: MeditationSession[]) => {
        set({ sessions });
      },

      // Load user preferences from Supabase
      loadPreferences: (prefs) => {
        set({
          targetDuration: prefs.targetDuration,
          breathingPattern: prefs.breathingPattern,
          chimeInterval: prefs.chimeInterval,
          selectedBrainwave: prefs.selectedBrainwave,
        });
      },

      // Get the last completed session (for saving to Supabase)
      getLastSession: () => {
        return lastCompletedSession;
      },
    }));

// Helper function to get phase duration from pattern
export function getPhaseDuration(
  pattern: BreathingPatternName,
  phase: BreathingPhase
): number {
  const p = BREATHING_PATTERNS[pattern];
  switch (phase) {
    case 'inhale':
      return p.inhale;
    case 'hold-in':
      return p.holdIn;
    case 'exhale':
      return p.exhale;
    case 'hold-out':
      return p.holdOut;
    default:
      return 0;
  }
}

// Helper to get next phase
export function getNextPhase(
  pattern: BreathingPatternName,
  currentPhase: BreathingPhase
): BreathingPhase {
  const phases: BreathingPhase[] = ['inhale', 'hold-in', 'exhale', 'hold-out'];
  const p = BREATHING_PATTERNS[pattern];

  // Skip hold-out if duration is 0 (like in 4-7-8 pattern)
  if (currentPhase === 'exhale' && p.holdOut === 0) {
    return 'inhale';
  }

  const currentIndex = phases.indexOf(currentPhase);
  const nextIndex = (currentIndex + 1) % phases.length;
  return phases[nextIndex];
}

// Helper to get total cycle duration
export function getCycleDuration(pattern: BreathingPatternName): number {
  const p = BREATHING_PATTERNS[pattern];
  return p.inhale + p.holdIn + p.exhale + p.holdOut;
}
