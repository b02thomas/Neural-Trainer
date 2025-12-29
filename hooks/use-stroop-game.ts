import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '@/stores/game-store';
import { useTimer } from './use-timer';
import { ColorName } from '@/types/game';
import { getTimeoutConfig } from '@/lib/timeout-calculator';

/**
 * Main game orchestration hook
 * Combines game state management (Zustand) with precision timing and timeout logic
 */
export function useStroopGame() {
  const store = useGameStore();
  const timer = useTimer();

  // Timeout state
  const [timeRemaining, setTimeRemaining] = useState<number>(5000);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  // Get current timeout config based on streak
  const timeoutConfig = getTimeoutConfig(store.currentStreak);

  // Store timer in a ref to avoid circular dependencies
  const timerRef = useRef(timer);

  // Update ref on every render to always have the latest timer functions
  useEffect(() => {
    timerRef.current = timer;
  });

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  // Auto-start timer and timeout when round starts
  useEffect(() => {
    if (store.status === 'playing' && store.roundStartTime !== null) {
      timerRef.current.reset();
      timerRef.current.start();

      // Get timeout for current streak
      const { timeoutMs } = getTimeoutConfig(store.currentStreak);
      setTimeRemaining(timeoutMs);

      // Clear any existing timers
      clearTimers();

      // Start countdown interval (update every 50ms for smooth display)
      const startTime = performance.now();
      intervalIdRef.current = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const remaining = Math.max(0, timeoutMs - elapsed);
        setTimeRemaining(remaining);
      }, 50);

      // Set timeout for auto-fail
      timeoutIdRef.current = setTimeout(() => {
        // Auto-submit with timeout
        timerRef.current.stop();
        store.submitAnswer(null, timeoutMs);
        clearTimers();
      }, timeoutMs);

    } else if (store.status !== 'playing') {
      timerRef.current.stop();
      clearTimers();
    }

    return () => clearTimers();
  }, [store.status, store.roundStartTime, store.currentStreak, clearTimers, store]);

  // Handle answer selection
  const handleAnswerSelection = (color: ColorName) => {
    if (store.status !== 'playing') {
      return;
    }

    // Clear timeout since user answered
    clearTimers();

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
    clearTimers();
    store.startGame(totalRounds);
  };

  // Move to next round (called after feedback is shown)
  const nextRound = () => {
    timer.reset();
    clearTimers();
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

    // Timeout state
    timeoutMs: timeoutConfig.timeoutMs,
    timeRemaining,
    speedLevel: timeoutConfig.speedLevel,

    // Actions
    startGame,
    handleAnswerSelection,
    nextRound,
    pauseGame: store.pauseGame,
    resumeGame: store.resumeGame,
    resetGame: () => {
      timer.reset();
      clearTimers();
      store.resetGame();
    },
  };
}
