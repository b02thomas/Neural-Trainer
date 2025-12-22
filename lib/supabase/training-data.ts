import { createClient } from './client';
import type { RoundResult, ColorName, AnswerOutcome } from '@/types/game';
import type { MeditationSession, MeditationType, SessionDuration, BreathingPatternName, ChimeInterval, BrainwaveType } from '@/types/meditation';

// ============================================
// Database Types (matching migration schema)
// ============================================

interface DbStroopRound {
  id: string;
  user_id: string;
  word: string;
  ink_color: string;
  selected_color: string;
  outcome: string;
  reaction_time_ms: number;
  created_at: string;
}

interface DbStroopStats {
  user_id: string;
  best_streak: number;
  total_rounds: number;
  updated_at: string;
}

interface DbMeditationSession {
  id: string;
  user_id: string;
  type: string;
  target_duration: number;
  actual_duration_ms: number;
  breathing_pattern: string | null;
  cycles_completed: number | null;
  regions_completed: number | null;
  thoughts_noticed: number | null;
  brainwave_type: string | null;
  completed_at: string;
}

interface DbUserPreferences {
  user_id: string;
  stroop_total_rounds: number;
  meditation_target_duration: number;
  breathing_pattern: string;
  chime_interval: number;
  selected_brainwave: string;
  updated_at: string;
}

// ============================================
// Stroop Game Functions
// ============================================

/**
 * Save a single Stroop round result
 */
export async function saveStroopRound(round: RoundResult): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('stroop_rounds')
    .insert({
      user_id: user.id,
      word: round.challenge.word,
      ink_color: round.challenge.inkColor,
      selected_color: round.selectedColor,
      outcome: round.outcome,
      reaction_time_ms: round.reactionTimeMs,
    });

  if (error) {
    console.error('Error saving stroop round:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Save multiple Stroop rounds at once (batch insert)
 */
export async function saveStroopRounds(rounds: RoundResult[]): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const dbRounds = rounds.map(round => ({
    user_id: user.id,
    word: round.challenge.word,
    ink_color: round.challenge.inkColor,
    selected_color: round.selectedColor,
    outcome: round.outcome,
    reaction_time_ms: round.reactionTimeMs,
  }));

  const { error } = await supabase
    .from('stroop_rounds')
    .insert(dbRounds);

  if (error) {
    console.error('Error saving stroop rounds:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get Stroop rounds for the current user
 */
export async function getStroopRounds(limit: number = 100): Promise<RoundResult[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('stroop_rounds')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching stroop rounds:', error);
    return [];
  }

  // Convert DB format to app format
  return (data as DbStroopRound[]).map(dbRound => ({
    challenge: {
      id: dbRound.id,
      word: dbRound.word as ColorName,
      inkColor: dbRound.ink_color as ColorName,
      createdAt: new Date(dbRound.created_at).getTime(),
    },
    selectedColor: dbRound.selected_color as ColorName,
    outcome: dbRound.outcome as AnswerOutcome,
    reactionTimeMs: dbRound.reaction_time_ms,
    timestamp: new Date(dbRound.created_at).getTime(),
  }));
}

/**
 * Get or create stroop stats for the current user
 */
export async function getStroopStats(): Promise<DbStroopStats | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('stroop_stats')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching stroop stats:', error);
    return null;
  }

  return data as DbStroopStats | null;
}

/**
 * Update stroop stats (best streak and total rounds)
 */
export async function updateStroopStats(bestStreak: number, totalRounds: number): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('stroop_stats')
    .upsert({
      user_id: user.id,
      best_streak: bestStreak,
      total_rounds: totalRounds,
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    console.error('Error updating stroop stats:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================
// Meditation Functions
// ============================================

/**
 * Save a meditation session
 */
export async function saveMeditationSession(session: MeditationSession): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('meditation_sessions')
    .insert({
      user_id: user.id,
      type: session.type,
      target_duration: session.duration,
      actual_duration_ms: session.actualDurationMs,
      breathing_pattern: session.breathingPattern || null,
      cycles_completed: session.cyclesCompleted || null,
      regions_completed: session.regionsCompleted || null,
      thoughts_noticed: session.thoughtsNoticed || null,
      brainwave_type: session.brainwaveType && session.brainwaveType !== 'off' ? session.brainwaveType : null,
    });

  if (error) {
    console.error('Error saving meditation session:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get meditation sessions for the current user
 */
export async function getMeditationSessions(limit: number = 100): Promise<MeditationSession[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('meditation_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching meditation sessions:', error);
    return [];
  }

  // Convert DB format to app format
  return (data as DbMeditationSession[]).map(dbSession => ({
    id: dbSession.id,
    type: dbSession.type as MeditationType,
    duration: dbSession.target_duration as SessionDuration,
    completedAt: new Date(dbSession.completed_at).getTime(),
    actualDurationMs: dbSession.actual_duration_ms,
    breathingPattern: dbSession.breathing_pattern as BreathingPatternName | undefined,
    cyclesCompleted: dbSession.cycles_completed || undefined,
    regionsCompleted: dbSession.regions_completed || undefined,
    thoughtsNoticed: dbSession.thoughts_noticed || undefined,
    brainwaveType: (dbSession.brainwave_type as BrainwaveType) || undefined,
  }));
}

// ============================================
// User Preferences Functions
// ============================================

export interface UserPreferences {
  stroopTotalRounds: number;
  meditationTargetDuration: SessionDuration;
  breathingPattern: BreathingPatternName;
  chimeInterval: ChimeInterval;
  selectedBrainwave: BrainwaveType;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  stroopTotalRounds: 20,
  meditationTargetDuration: 5,
  breathingPattern: '4-4-4-4',
  chimeInterval: 60,
  selectedBrainwave: 'off',
};

/**
 * Get user preferences
 */
export async function getUserPreferences(): Promise<UserPreferences> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return DEFAULT_PREFERENCES;

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user preferences:', error);
    return DEFAULT_PREFERENCES;
  }

  if (!data) return DEFAULT_PREFERENCES;

  const prefs = data as DbUserPreferences;
  return {
    stroopTotalRounds: prefs.stroop_total_rounds,
    meditationTargetDuration: prefs.meditation_target_duration as SessionDuration,
    breathingPattern: prefs.breathing_pattern as BreathingPatternName,
    chimeInterval: prefs.chime_interval as ChimeInterval,
    selectedBrainwave: prefs.selected_brainwave as BrainwaveType,
  };
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(prefs: Partial<UserPreferences>): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const updateData: Partial<DbUserPreferences> = {};
  if (prefs.stroopTotalRounds !== undefined) updateData.stroop_total_rounds = prefs.stroopTotalRounds;
  if (prefs.meditationTargetDuration !== undefined) updateData.meditation_target_duration = prefs.meditationTargetDuration;
  if (prefs.breathingPattern !== undefined) updateData.breathing_pattern = prefs.breathingPattern;
  if (prefs.chimeInterval !== undefined) updateData.chime_interval = prefs.chimeInterval;
  if (prefs.selectedBrainwave !== undefined) updateData.selected_brainwave = prefs.selectedBrainwave;

  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: user.id,
      ...updateData,
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    console.error('Error updating user preferences:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================
// Auth Helper
// ============================================

/**
 * Check if user is currently authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}
