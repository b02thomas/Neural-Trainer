// Color type - base colors plus unlockable colors
export type ColorName = 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | 'BLACK' | 'PURPLE' | 'ORANGE' | 'PINK' | 'CYAN';

// Base colors available at game start
export const BASE_COLORS: ColorName[] = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'BLACK'];

// Extra colors unlocked at streak milestones
export const EXTRA_COLORS: ColorName[] = ['PURPLE', 'ORANGE', 'PINK', 'CYAN'];

// Streak milestones where new colors are unlocked
export const UNLOCK_MILESTONES = [3, 6, 9, 12];

// Color configuration interface
export interface ColorConfig {
  displayName: string;
  hexValue: string;
  tailwindClass: string;
  buttonClass: string;
}

// Stroop challenge - a single test item
export interface StroopChallenge {
  id: string;
  word: ColorName;           // The word displayed (e.g., "ROT")
  inkColor: ColorName;        // The color of the ink (e.g., "BLAU")
  createdAt: number;         // Timestamp when challenge was created
}

// Answer outcome types
export type AnswerOutcome = 'success' | 'impulse_error' | 'wrong_choice';

// Result of a single round
export interface RoundResult {
  challenge: StroopChallenge;
  selectedColor: ColorName;
  outcome: AnswerOutcome;
  reactionTimeMs: number;
  timestamp: number;
}

// Game status states
export type GameStatus = 'idle' | 'countdown' | 'playing' | 'paused' | 'finished';

// Main game state
export interface GameState {
  status: GameStatus;
  currentChallenge: StroopChallenge | null;
  roundStartTime: number | null;
  rounds: RoundResult[];
  currentStreak: number;          // Current consecutive correct answers
  bestStreak: number;             // Best streak in current session
  totalRounds: number;            // Target number of rounds
  currentRoundNumber: number;     // Current round (1-indexed)
  activeColors: ColorName[];      // Currently active colors for challenges
  buttonOrder: ColorName[];       // Current order of color buttons (shuffled)
}

// Session statistics for analytics
export interface SessionStatistics {
  totalRounds: number;
  correctAnswers: number;
  impulseErrors: number;
  wrongChoices: number;
  accuracyRate: number;           // Percentage (0-100)
  averageReactionTime: number;    // In milliseconds
  fastestReactionTime: number;    // In milliseconds
  slowestReactionTime: number;    // In milliseconds
  longestStreak: number;
  averageInterferenceCost?: number; // Optional: difference between avg reaction for congruent vs incongruent
}

// Helper type for color dictionary
export type ColorDictionary = Record<ColorName, ColorConfig>;
