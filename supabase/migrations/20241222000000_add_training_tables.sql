-- Migration: Add Training Tables
-- Description: Creates tables for Stroop game and meditation session tracking

-- ============================================
-- Table: stroop_rounds
-- Stores individual round results from Stroop game
-- ============================================
CREATE TABLE stroop_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Challenge Data
  word TEXT NOT NULL,
  ink_color TEXT NOT NULL,

  -- Result Data
  selected_color TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('success', 'impulse_error', 'wrong_choice')),
  reaction_time_ms INTEGER NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for stroop_rounds
CREATE INDEX idx_stroop_rounds_user ON stroop_rounds(user_id);
CREATE INDEX idx_stroop_rounds_created ON stroop_rounds(created_at DESC);

-- ============================================
-- Table: stroop_stats
-- Aggregated statistics per user
-- ============================================
CREATE TABLE stroop_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  best_streak INTEGER DEFAULT 0,
  total_rounds INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Table: meditation_sessions
-- Stores completed meditation sessions
-- ============================================
CREATE TABLE meditation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Session Data
  type TEXT NOT NULL CHECK (type IN ('breathing', 'body-scan', 'open-monitoring')),
  target_duration INTEGER NOT NULL,
  actual_duration_ms INTEGER NOT NULL,

  -- Type-specific Data (nullable)
  breathing_pattern TEXT,
  cycles_completed INTEGER,
  regions_completed INTEGER,
  thoughts_noticed INTEGER,
  brainwave_type TEXT CHECK (brainwave_type IS NULL OR brainwave_type IN ('alpha', 'theta')),

  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for meditation_sessions
CREATE INDEX idx_meditation_sessions_user ON meditation_sessions(user_id);
CREATE INDEX idx_meditation_sessions_completed ON meditation_sessions(completed_at DESC);

-- ============================================
-- Table: user_preferences
-- User settings for training features
-- ============================================
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Stroop Preferences
  stroop_total_rounds INTEGER DEFAULT 20,

  -- Meditation Preferences
  meditation_target_duration INTEGER DEFAULT 5,
  breathing_pattern TEXT DEFAULT '4-4-4-4',
  chime_interval INTEGER DEFAULT 60,
  selected_brainwave TEXT DEFAULT 'off',

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE stroop_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE stroop_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies for stroop_rounds
CREATE POLICY "Users can read own stroop_rounds"
  ON stroop_rounds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stroop_rounds"
  ON stroop_rounds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for stroop_stats
CREATE POLICY "Users can read own stroop_stats"
  ON stroop_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stroop_stats"
  ON stroop_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stroop_stats"
  ON stroop_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for meditation_sessions
CREATE POLICY "Users can read own meditation_sessions"
  ON meditation_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meditation_sessions"
  ON meditation_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_preferences
CREATE POLICY "Users can read own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Function: Update timestamp trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_stroop_stats_updated_at
  BEFORE UPDATE ON stroop_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
