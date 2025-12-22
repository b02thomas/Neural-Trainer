'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useMeditationStore, getPhaseDuration, getNextPhase } from '@/stores/meditation-store';
import { BODY_REGIONS } from '@/types/meditation';

interface UseMeditationTimerOptions {
  onComplete?: () => void;
  onPhaseChange?: (phase: string) => void;
  onRegionChange?: (regionIndex: number) => void;
  onChime?: () => void;
}

export function useMeditationTimer(options: UseMeditationTimerOptions = {}) {
  const {
    status,
    currentType,
    targetDuration,
    elapsedMs,
    breathingPattern,
    currentPhase,
    phaseProgress,
    cycleCount,
    currentRegionIndex,
    regionProgress,
    chimeInterval,
    lastChimeTime,
    updateElapsed,
    setPhase,
    setPhaseProgress,
    incrementCycle,
    nextRegion,
    setRegionProgress,
    recordChime,
    completeSession,
  } = useMeditationStore();

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const phaseStartTimeRef = useRef<number>(0);
  const regionStartTimeRef = useRef<number>(0);

  const targetDurationMs = targetDuration * 60 * 1000;

  // Handle session completion
  const handleComplete = useCallback(() => {
    completeSession();
    options.onComplete?.();
  }, [completeSession, options]);

  // Main animation loop
  const tick = useCallback(() => {
    if (status !== 'active') return;

    const now = performance.now();
    if (startTimeRef.current === null) {
      startTimeRef.current = now;
      phaseStartTimeRef.current = now;
      regionStartTimeRef.current = now;
    }

    const elapsed = now - startTimeRef.current;
    updateElapsed(elapsed);

    // Check if session is complete
    if (elapsed >= targetDurationMs) {
      handleComplete();
      return;
    }

    // Handle type-specific updates
    if (currentType === 'breathing') {
      updateBreathing(now);
    } else if (currentType === 'body-scan') {
      updateBodyScan(now, elapsed);
    } else if (currentType === 'open-monitoring') {
      updateOpenMonitoring(elapsed);
    }

    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(tick);
  }, [status, currentType, targetDurationMs, handleComplete, updateElapsed]);

  // Breathing update logic
  const updateBreathing = useCallback((now: number) => {
    const phaseDuration = getPhaseDuration(breathingPattern, currentPhase) * 1000;
    const phaseElapsed = now - phaseStartTimeRef.current;
    const progress = phaseElapsed / phaseDuration;

    if (progress >= 1) {
      // Move to next phase
      const nextPhaseValue = getNextPhase(breathingPattern, currentPhase);

      // If we're starting a new cycle (back to inhale)
      if (nextPhaseValue === 'inhale' && currentPhase !== 'inhale') {
        incrementCycle();
      }

      setPhase(nextPhaseValue);
      phaseStartTimeRef.current = now;
      options.onPhaseChange?.(nextPhaseValue);
    } else {
      setPhaseProgress(progress);
    }
  }, [breathingPattern, currentPhase, setPhase, setPhaseProgress, incrementCycle, options]);

  // Body-Scan update logic
  const updateBodyScan = useCallback((now: number, elapsed: number) => {
    const totalRegions = BODY_REGIONS.length;
    const timePerRegion = targetDurationMs / totalRegions;

    // Calculate which region we should be on based on elapsed time
    const expectedRegionIndex = Math.min(
      Math.floor(elapsed / timePerRegion),
      totalRegions - 1
    );

    if (expectedRegionIndex > currentRegionIndex) {
      nextRegion();
      regionStartTimeRef.current = now;
      options.onRegionChange?.(expectedRegionIndex);
    }

    // Update progress within current region
    const regionElapsed = now - regionStartTimeRef.current;
    const regionProgress = Math.min(1, regionElapsed / timePerRegion);
    setRegionProgress(regionProgress);
  }, [targetDurationMs, currentRegionIndex, nextRegion, setRegionProgress, options]);

  // Open Monitoring update logic
  const updateOpenMonitoring = useCallback((elapsed: number) => {
    if (chimeInterval === 0) return;

    const chimeIntervalMs = chimeInterval * 1000;
    const timeSinceLastChime = lastChimeTime
      ? elapsed - (lastChimeTime - (performance.now() - elapsed))
      : elapsed;

    if (timeSinceLastChime >= chimeIntervalMs) {
      recordChime();
      options.onChime?.();
    }
  }, [chimeInterval, lastChimeTime, recordChime, options]);

  // Start/stop animation loop based on status
  useEffect(() => {
    if (status === 'active') {
      startTimeRef.current = performance.now() - elapsedMs;
      phaseStartTimeRef.current = performance.now();
      regionStartTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [status, tick, elapsedMs]);

  // Handle tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && status === 'active') {
        useMeditationStore.getState().pauseSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status]);

  // Calculate remaining time
  const remainingMs = Math.max(0, targetDurationMs - elapsedMs);
  const remainingMinutes = Math.floor(remainingMs / 60000);
  const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
  const progress = elapsedMs / targetDurationMs;

  return {
    status,
    currentType,
    elapsedMs,
    remainingMs,
    remainingMinutes,
    remainingSeconds,
    progress,
    targetDurationMs,

    // Breathing specific
    currentPhase,
    phaseProgress,
    cycleCount,

    // Body-Scan specific
    currentRegionIndex,
    currentRegion: BODY_REGIONS[currentRegionIndex],
    regionProgress,
    totalRegions: BODY_REGIONS.length,
  };
}

// Format time as MM:SS
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Format time as M:SS for compact display
export function formatTimeCompact(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
