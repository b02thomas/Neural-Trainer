import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerReturn {
  elapsedTime: number;      // Current elapsed time in milliseconds
  isRunning: boolean;       // Whether the timer is currently running
  start: () => void;        // Start or resume the timer
  stop: () => void;         // Stop the timer
  reset: () => void;        // Reset the timer to 0
  getElapsedTime: () => number; // Get current elapsed time without re-rendering
}

/**
 * High-precision timer hook using performance.now()
 * Provides sub-millisecond accuracy for reaction time measurement
 */
export function useTimer(): UseTimerReturn {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Start or resume the timer
  const start = useCallback(() => {
    // Only start if not already running (checked via ref instead of state)
    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
      setIsRunning(true);
    }
  }, []);

  // Stop the timer
  const stop = useCallback(() => {
    // Always safe to cancel animation frame (no-op if not running)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsRunning(false);
  }, []);

  // Reset the timer to 0
  const reset = useCallback(() => {
    // Cancel any ongoing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    // Reset state
    startTimeRef.current = null;
    setElapsedTime(0);
    setIsRunning(false);
  }, []);

  // Get current elapsed time without triggering a re-render
  const getElapsedTime = useCallback(() => {
    if (startTimeRef.current === null) {
      return 0; // Return 0 instead of elapsedTime
    }
    return performance.now() - startTimeRef.current;
  }, []);

  // Start/stop animation frame based on isRunning
  useEffect(() => {
    if (isRunning) {
      // Inline animation logic to avoid dependency on updateElapsedTime
      const animate = () => {
        if (startTimeRef.current !== null) {
          const currentTime = performance.now();
          const elapsed = currentTime - startTimeRef.current;
          setElapsedTime(elapsed);
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };
      animationFrameRef.current = requestAnimationFrame(animate);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning]);

  // Pause timer when tab is hidden (prevents inaccurate measurements)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        stop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning, stop]);

  return {
    elapsedTime,
    isRunning,
    start,
    stop,
    reset,
    getElapsedTime,
  };
}
