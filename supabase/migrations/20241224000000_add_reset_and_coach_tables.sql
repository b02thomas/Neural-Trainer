-- Migration: Add Reset and Coach Tables
-- Description: Creates tables for trader reset/recovery tools and AI psychology coach

-- ============================================
-- RESET/RECOVERY TABLES
-- ============================================

-- ============================================
-- Table: trading_rules
-- User-defined trading rules for reminders
-- ============================================
CREATE TABLE trading_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  rule_text TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('entry', 'exit', 'risk', 'emotional', 'general')),
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trading_rules_user ON trading_rules(user_id);
CREATE INDEX idx_trading_rules_category ON trading_rules(user_id, category);

-- ============================================
-- Table: reset_sessions
-- Logs of reset/intervention sessions
-- ============================================
CREATE TABLE reset_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  type TEXT NOT NULL CHECK (type IN (
    'grounding_sensory', 'grounding_questions', 'breathing_quick',
    'physical_reset', 'perspective_shift', 'checklist', 'cooldown'
  )),
  trigger TEXT CHECK (trigger IN (
    'loss', 'missed_trade', 'fomo', 'revenge_trading',
    'overtrading', 'frustration', 'anxiety', 'manual'
  )),
  duration_seconds INTEGER,
  emotional_state_before INTEGER CHECK (emotional_state_before >= 1 AND emotional_state_before <= 10),
  emotional_state_after INTEGER CHECK (emotional_state_after >= 1 AND emotional_state_after <= 10),
  notes TEXT,

  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reset_sessions_user ON reset_sessions(user_id);
CREATE INDEX idx_reset_sessions_completed ON reset_sessions(completed_at DESC);

-- ============================================
-- Table: checklist_items
-- User-customizable checklist items
-- ============================================
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  checklist_type TEXT NOT NULL CHECK (checklist_type IN ('pre_trade', 'post_loss', 'post_win')),
  item_text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_checklist_items_user ON checklist_items(user_id);
CREATE INDEX idx_checklist_items_type ON checklist_items(user_id, checklist_type);

-- ============================================
-- Table: checklist_completions
-- Log of completed checklists
-- ============================================
CREATE TABLE checklist_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  checklist_type TEXT NOT NULL CHECK (checklist_type IN ('pre_trade', 'post_loss', 'post_win')),
  items_checked JSONB NOT NULL,
  notes TEXT,

  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_checklist_completions_user ON checklist_completions(user_id);
CREATE INDEX idx_checklist_completions_completed ON checklist_completions(completed_at DESC);

-- ============================================
-- Table: cooldown_sessions
-- Forced break timer sessions
-- ============================================
CREATE TABLE cooldown_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  reason TEXT,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes IN (5, 15, 30, 60)),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  was_completed BOOLEAN DEFAULT false
);

CREATE INDEX idx_cooldown_sessions_user ON cooldown_sessions(user_id);
CREATE INDEX idx_cooldown_sessions_started ON cooldown_sessions(started_at DESC);

-- ============================================
-- AI COACH TABLES
-- ============================================

-- ============================================
-- Table: coach_preferences
-- User preferences for AI coach
-- ============================================
CREATE TABLE coach_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  focus_areas JSONB DEFAULT '["trading"]',
  preferred_model TEXT DEFAULT 'anthropic/claude-3.5-sonnet',
  coaching_style TEXT DEFAULT 'supportive' CHECK (coaching_style IN ('direct', 'supportive', 'socratic')),
  daily_checkin_enabled BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  system_prompt_additions TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Table: coach_conversations
-- Chat conversation sessions
-- ============================================
CREATE TABLE coach_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  title TEXT,
  focus_area TEXT DEFAULT 'general' CHECK (focus_area IN ('trading', 'fitness', 'work', 'relationships', 'general')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coach_conversations_user ON coach_conversations(user_id);
CREATE INDEX idx_coach_conversations_updated ON coach_conversations(updated_at DESC);

-- ============================================
-- Table: coach_messages
-- Individual messages in conversations
-- ============================================
CREATE TABLE coach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES coach_conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model TEXT,
  tokens_used INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coach_messages_conversation ON coach_messages(conversation_id);
CREATE INDEX idx_coach_messages_user ON coach_messages(user_id);
CREATE INDEX idx_coach_messages_created ON coach_messages(created_at);

-- ============================================
-- Table: emotional_logs
-- Emotional state tracking
-- ============================================
CREATE TABLE emotional_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES coach_conversations(id) ON DELETE SET NULL,

  emotion TEXT NOT NULL CHECK (emotion IN (
    'anxious', 'frustrated', 'angry', 'fearful', 'sad', 'overwhelmed',
    'calm', 'confident', 'excited', 'content', 'focused', 'neutral'
  )),
  intensity INTEGER NOT NULL CHECK (intensity >= 1 AND intensity <= 10),
  context TEXT CHECK (context IN ('trading', 'fitness', 'work', 'relationships', 'general')),
  trigger TEXT,
  notes TEXT,

  logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_emotional_logs_user ON emotional_logs(user_id);
CREATE INDEX idx_emotional_logs_logged ON emotional_logs(logged_at DESC);
CREATE INDEX idx_emotional_logs_emotion ON emotional_logs(user_id, emotion);

-- ============================================
-- Table: pattern_insights
-- Detected psychological patterns
-- ============================================
CREATE TABLE pattern_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  pattern_type TEXT NOT NULL CHECK (pattern_type IN (
    'recurring_thought', 'emotional_trigger', 'behavior_pattern', 'improvement'
  )),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  frequency INTEGER DEFAULT 1,
  first_detected_at TIMESTAMPTZ DEFAULT NOW(),
  last_detected_at TIMESTAMPTZ DEFAULT NOW(),
  is_acknowledged BOOLEAN DEFAULT false
);

CREATE INDEX idx_pattern_insights_user ON pattern_insights(user_id);
CREATE INDEX idx_pattern_insights_type ON pattern_insights(user_id, pattern_type);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE trading_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE reset_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooldown_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotional_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_insights ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Policies for trading_rules
-- ============================================
CREATE POLICY "Users can read own trading_rules"
  ON trading_rules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trading_rules"
  ON trading_rules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trading_rules"
  ON trading_rules FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trading_rules"
  ON trading_rules FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Policies for reset_sessions
-- ============================================
CREATE POLICY "Users can read own reset_sessions"
  ON reset_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reset_sessions"
  ON reset_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Policies for checklist_items
-- ============================================
CREATE POLICY "Users can read own checklist_items"
  ON checklist_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checklist_items"
  ON checklist_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checklist_items"
  ON checklist_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own checklist_items"
  ON checklist_items FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Policies for checklist_completions
-- ============================================
CREATE POLICY "Users can read own checklist_completions"
  ON checklist_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checklist_completions"
  ON checklist_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Policies for cooldown_sessions
-- ============================================
CREATE POLICY "Users can read own cooldown_sessions"
  ON cooldown_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cooldown_sessions"
  ON cooldown_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cooldown_sessions"
  ON cooldown_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Policies for coach_preferences
-- ============================================
CREATE POLICY "Users can read own coach_preferences"
  ON coach_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coach_preferences"
  ON coach_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coach_preferences"
  ON coach_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Policies for coach_conversations
-- ============================================
CREATE POLICY "Users can read own coach_conversations"
  ON coach_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coach_conversations"
  ON coach_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coach_conversations"
  ON coach_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own coach_conversations"
  ON coach_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Policies for coach_messages
-- ============================================
CREATE POLICY "Users can read own coach_messages"
  ON coach_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coach_messages"
  ON coach_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Policies for emotional_logs
-- ============================================
CREATE POLICY "Users can read own emotional_logs"
  ON emotional_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emotional_logs"
  ON emotional_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emotional_logs"
  ON emotional_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Policies for pattern_insights
-- ============================================
CREATE POLICY "Users can read own pattern_insights"
  ON pattern_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pattern_insights"
  ON pattern_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pattern_insights"
  ON pattern_insights FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Triggers for updated_at columns
-- ============================================
-- Using existing update_updated_at_column() function from previous migration

CREATE TRIGGER update_trading_rules_updated_at
  BEFORE UPDATE ON trading_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coach_preferences_updated_at
  BEFORE UPDATE ON coach_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coach_conversations_updated_at
  BEFORE UPDATE ON coach_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
