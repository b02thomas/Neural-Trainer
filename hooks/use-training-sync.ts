'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  getStroopRounds,
  getStroopStats,
  saveStroopRounds,
  updateStroopStats,
  getMeditationSessions,
  saveMeditationSession,
  getUserPreferences,
  updateUserPreferences,
  isAuthenticated,
  type UserPreferences,
} from '@/lib/supabase/training-data';
import type { RoundResult } from '@/types/game';
import type { MeditationSession } from '@/types/meditation';

interface UseTrainingSyncOptions {
  onStroopDataLoaded?: (rounds: RoundResult[], bestStreak: number) => void;
  onMeditationDataLoaded?: (sessions: MeditationSession[]) => void;
  onPreferencesLoaded?: (prefs: UserPreferences) => void;
}

interface SyncState {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

/**
 * Hook for syncing training data with Supabase
 * - Loads data on mount if authenticated
 * - Provides functions to save data
 * - Subscribes to auth state changes
 */
export function useTrainingSync(options: UseTrainingSyncOptions = {}) {
  const { onStroopDataLoaded, onMeditationDataLoaded, onPreferencesLoaded } = options;

  const [state, setState] = useState<SyncState>({
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Check auth and load initial data
  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const authenticated = await isAuthenticated();
      setState(prev => ({ ...prev, isAuthenticated: authenticated }));

      if (!authenticated) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Load all data in parallel
      const [rounds, stats, sessions, prefs] = await Promise.all([
        getStroopRounds(100),
        getStroopStats(),
        getMeditationSessions(100),
        getUserPreferences(),
      ]);

      // Call callbacks with loaded data
      if (onStroopDataLoaded) {
        onStroopDataLoaded(rounds, stats?.best_streak ?? 0);
      }

      if (onMeditationDataLoaded) {
        onMeditationDataLoaded(sessions);
      }

      if (onPreferencesLoaded) {
        onPreferencesLoaded(prefs);
      }

      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Error loading training data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
      }));
    }
  }, [onStroopDataLoaded, onMeditationDataLoaded, onPreferencesLoaded]);

  // Subscribe to auth state changes
  useEffect(() => {
    const supabase = createClient();

    // Load data initially
    loadData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        loadData();
      } else if (event === 'SIGNED_OUT') {
        setState({
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadData]);

  // Save Stroop game data
  const saveStroopGame = useCallback(async (rounds: RoundResult[], bestStreak: number) => {
    if (!state.isAuthenticated) return { success: false, error: 'Not authenticated' };

    const [roundsResult, statsResult] = await Promise.all([
      saveStroopRounds(rounds),
      updateStroopStats(bestStreak, rounds.length),
    ]);

    if (!roundsResult.success) return roundsResult;
    if (!statsResult.success) return statsResult;

    return { success: true };
  }, [state.isAuthenticated]);

  // Save Meditation session
  const saveMeditation = useCallback(async (session: MeditationSession) => {
    if (!state.isAuthenticated) return { success: false, error: 'Not authenticated' };
    return saveMeditationSession(session);
  }, [state.isAuthenticated]);

  // Save preferences
  const savePreferences = useCallback(async (prefs: Partial<UserPreferences>) => {
    if (!state.isAuthenticated) return { success: false, error: 'Not authenticated' };
    return updateUserPreferences(prefs);
  }, [state.isAuthenticated]);

  return {
    ...state,
    saveStroopGame,
    saveMeditation,
    savePreferences,
    reload: loadData,
  };
}

/**
 * Simplified hook for just checking if user is authenticated
 * and can sync data
 */
export function useCanSync() {
  const [canSync, setCanSync] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setCanSync(authenticated);
      setIsChecking(false);
    };

    checkAuth();

    // Subscribe to auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      setCanSync(event === 'SIGNED_IN');
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { canSync, isChecking };
}
