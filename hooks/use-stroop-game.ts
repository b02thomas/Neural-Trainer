import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/game-store';
import { useTimer } from './use-timer';
import { ColorName } from '@/types/game';

/**
 * Main game orchestration hook
 * Combines game state management (Zustand) with precision timing
 */
export function useStroopGame() {
  const store = useGameStore();
  const timer = useTimer();

  // Store timer in a ref to avoid circular dependencies
  const timerRef = useRef(timer);

  // Update ref on every render to always have the latest timer functions
  useEffect(() => {
    timerRef.current = timer;
  });

  // Auto-start timer when round starts
  useEffect(() => {
    if (store.status === 'playing' && store.roundStartTime !== null) {
      timerRef.current.reset();
      timerRef.current.start();
    } else if (store.status !== 'playing') {
      timerRef.current.stop();
    }
  }, [store.status, store.roundStartTime]);

  // Handle answer selection
  const handleAnswerSelection = (color: ColorName) => {
    if (store.status !== 'playing') {
      return;
    }

    // Get precise reaction time
    const reactionTime = timer.getElapsedTime();

    // Stop timer
    timer.stop();

    // Submit answer to store
    store.submitAnswer(color, reactionTime);
  };

  // Start game with optional round count
  const startGame = (totalRounds?: number) => {
    timer.reset();
    store.startGame(totalRounds);
  };

  // Move to next round (called after feedback is shown)
  const nextRound = () => {
    timer.reset();
    store.nextRound();
  };

  return {
    // Game state
    status: store.status,
    currentChallenge: store.currentChallenge,
    currentRoundNumber: store.currentRoundNumber,
    totalRounds: store.totalRounds,
    rounds: store.rounds,
    currentStreak: store.currentStreak,
    bestStreak: store.bestStreak,
    activeColors: store.activeColors,
    buttonOrder: store.buttonOrder,

    // Timer state
    elapsedTime: timer.elapsedTime,
    isTimerRunning: timer.isRunning,

    // Actions
    startGame,
    handleAnswerSelection,
    nextRound,
    pauseGame: store.pauseGame,
    resumeGame: store.resumeGame,
    resetGame: () => {
      timer.reset();
      store.resetGame();
    },
  };
}
