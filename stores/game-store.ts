import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, StroopChallenge, ColorName, RoundResult, BASE_COLORS, EXTRA_COLORS, UNLOCK_MILESTONES } from '@/types/game';
import { generateChallenge, validateAnswer } from '@/lib/stroop-generator';
import { shuffleArray } from '@/lib/colors';

interface GameStore extends GameState {
  // Actions
  startGame: (totalRounds?: number) => void;
  submitAnswer: (selectedColor: ColorName | null, reactionTimeMs: number) => void;
  nextRound: () => void;
  pauseGame: () => void;
  resetGame: () => void;
  resumeGame: () => void;
}

const DEFAULT_TOTAL_ROUNDS = 30;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      status: 'idle',
      currentChallenge: null,
      roundStartTime: null,
      rounds: [],
      currentStreak: 0,
      bestStreak: 0,
      totalRounds: DEFAULT_TOTAL_ROUNDS,
      currentRoundNumber: 0,
      activeColors: [...BASE_COLORS],
      buttonOrder: [...BASE_COLORS],

      // Start a new game
      startGame: (totalRounds = DEFAULT_TOTAL_ROUNDS) => {
        const initialColors = [...BASE_COLORS];
        const firstChallenge = generateChallenge(undefined, initialColors);
        set({
          status: 'countdown',
          totalRounds,
          currentRoundNumber: 1,
          rounds: [],
          currentStreak: 0,
          bestStreak: 0,
          currentChallenge: firstChallenge,
          roundStartTime: null,
          activeColors: initialColors,
          buttonOrder: initialColors,
        });

        // After countdown, start playing
        setTimeout(() => {
          set({
            status: 'playing',
            roundStartTime: performance.now(),
          });
        }, 3000); // 3 second countdown
      },

      // Submit an answer for the current challenge
      submitAnswer: (selectedColor: ColorName | null, reactionTimeMs: number) => {
        const state = get();
        if (state.status !== 'playing' || !state.currentChallenge) {
          return;
        }

        // Determine outcome - timeout if no color selected
        const outcome = selectedColor === null
          ? 'timeout'
          : validateAnswer(state.currentChallenge, selectedColor);

        // Create round result
        const roundResult: RoundResult = {
          challenge: state.currentChallenge,
          selectedColor,
          outcome,
          reactionTimeMs,
          timestamp: Date.now(),
        };

        // Update streak
        const newStreak = outcome === 'success' ? state.currentStreak + 1 : 0;
        const newBestStreak = Math.max(state.bestStreak, newStreak);

        // Add round result to history
        const newRounds = [...state.rounds, roundResult];

        // Check for milestone - unlock new color and shuffle (only if not already unlocked)
        let newActiveColors = state.activeColors;
        let newButtonOrder = state.buttonOrder;

        if (outcome === 'success' && UNLOCK_MILESTONES.includes(newStreak)) {
          const milestoneIndex = UNLOCK_MILESTONES.indexOf(newStreak);
          if (milestoneIndex < EXTRA_COLORS.length) {
            const newColor = EXTRA_COLORS[milestoneIndex];
            // Prevent duplicates - only add if color not already active
            if (!state.activeColors.includes(newColor)) {
              newActiveColors = [...state.activeColors, newColor];
              newButtonOrder = shuffleArray(newActiveColors);
            }
          }
        }

        // Check if game is finished
        const isFinished = state.currentRoundNumber >= state.totalRounds;

        if (isFinished) {
          set({
            rounds: newRounds,
            currentStreak: newStreak,
            bestStreak: newBestStreak,
            status: 'finished',
            currentChallenge: null,
            roundStartTime: null,
            activeColors: newActiveColors,
            buttonOrder: newButtonOrder,
          });
        } else {
          // Temporarily pause to show feedback, then move to next round
          set({
            rounds: newRounds,
            currentStreak: newStreak,
            bestStreak: newBestStreak,
            status: 'paused',
            activeColors: newActiveColors,
            buttonOrder: newButtonOrder,
          });

          // Auto-resume after brief pause for feedback (handled by component)
        }
      },

      // Move to next round
      nextRound: () => {
        const state = get();
        if (state.currentRoundNumber >= state.totalRounds) {
          return;
        }

        const nextChallenge = generateChallenge(state.currentChallenge || undefined, state.activeColors);
        set({
          status: 'playing',
          currentRoundNumber: state.currentRoundNumber + 1,
          currentChallenge: nextChallenge,
          roundStartTime: performance.now(),
        });
      },

      // Pause the game
      pauseGame: () => {
        const state = get();
        if (state.status === 'playing') {
          set({ status: 'paused' });
        }
      },

      // Resume the game
      resumeGame: () => {
        const state = get();
        if (state.status === 'paused') {
          set({
            status: 'playing',
            roundStartTime: performance.now(),
          });
        }
      },

      // Reset game to initial state
      resetGame: () => {
        set({
          status: 'idle',
          currentChallenge: null,
          roundStartTime: null,
          rounds: [],
          currentStreak: 0,
          bestStreak: 0,
          totalRounds: DEFAULT_TOTAL_ROUNDS,
          currentRoundNumber: 0,
          activeColors: [...BASE_COLORS],
          buttonOrder: [...BASE_COLORS],
        });
      },
    }),
    {
      name: 'stroop-game-storage',
      // Only persist rounds and best streak across sessions
      partialize: (state) => ({
        rounds: state.rounds.slice(-100), // Keep last 100 rounds
        bestStreak: state.bestStreak,
      }),
    }
  )
);
