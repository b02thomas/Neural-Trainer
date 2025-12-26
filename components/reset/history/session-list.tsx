'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Filter, X } from 'lucide-react';
import { useResetStore, getResetTypeDisplayName, getTriggerDisplayName } from '@/stores/reset-store';
import { ResetType, TriggerType } from '@/types/reset';
import { SessionCard } from './session-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const RESET_TYPES: ResetType[] = [
  'grounding_sensory',
  'grounding_questions',
  'breathing_quick',
  'physical_reset',
  'perspective_shift',
  'checklist',
  'cooldown',
];

const TRIGGER_TYPES: TriggerType[] = [
  'loss',
  'missed_trade',
  'fomo',
  'revenge_trading',
  'overtrading',
  'frustration',
  'anxiety',
  'manual',
];

interface SessionListProps {
  className?: string;
}

export function SessionList({ className }: SessionListProps) {
  const { recentSessions } = useResetStore();
  const [typeFilter, setTypeFilter] = useState<ResetType | null>(null);
  const [triggerFilter, setTriggerFilter] = useState<TriggerType | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort sessions
  const filteredSessions = useMemo(() => {
    let sessions = [...recentSessions];

    if (typeFilter) {
      sessions = sessions.filter((s) => s.type === typeFilter);
    }

    if (triggerFilter) {
      sessions = sessions.filter((s) => s.trigger === triggerFilter);
    }

    // Sort by date, newest first
    return sessions.sort((a, b) => b.completedAt - a.completedAt);
  }, [recentSessions, typeFilter, triggerFilter]);

  // Statistics
  const stats = useMemo(() => {
    if (recentSessions.length === 0) return null;

    const withEmotions = recentSessions.filter(
      (s) => s.emotionalStateBefore !== undefined && s.emotionalStateAfter !== undefined
    );

    const avgImprovement = withEmotions.length > 0
      ? withEmotions.reduce(
          (sum, s) => sum + ((s.emotionalStateAfter || 0) - (s.emotionalStateBefore || 0)),
          0
        ) / withEmotions.length
      : 0;

    return {
      total: recentSessions.length,
      avgImprovement: avgImprovement.toFixed(1),
    };
  }, [recentSessions]);

  const hasActiveFilters = typeFilter !== null || triggerFilter !== null;

  const clearFilters = () => {
    setTypeFilter(null);
    setTriggerFilter(null);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Stats summary */}
      {stats && (
        <div className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Total sessions:</span>{' '}
              <span className="font-medium">{stats.total}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Avg. improvement:</span>{' '}
              <span className={cn(
                'font-medium',
                parseFloat(stats.avgImprovement) > 0 ? 'text-green-400' :
                parseFloat(stats.avgImprovement) < 0 ? 'text-red-400' :
                'text-muted-foreground'
              )}>
                {parseFloat(stats.avgImprovement) > 0 ? '+' : ''}{stats.avgImprovement}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(hasActiveFilters && 'text-cyan-400')}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-xs">
                {(typeFilter ? 1 : 0) + (triggerFilter ? 1 : 0)}
              </span>
            )}
          </Button>
        </div>
      )}

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-4 space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Filter Sessions</span>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-3 h-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Type filter */}
            <div>
              <label className="text-xs text-muted-foreground block mb-2">Type</label>
              <div className="flex flex-wrap gap-2">
                {RESET_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(typeFilter === type ? null : type)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs transition-colors',
                      typeFilter === type
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                    )}
                  >
                    {getResetTypeDisplayName(type)}
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger filter */}
            <div>
              <label className="text-xs text-muted-foreground block mb-2">Trigger</label>
              <div className="flex flex-wrap gap-2">
                {TRIGGER_TYPES.map((trigger) => (
                  <button
                    key={trigger}
                    onClick={() => setTriggerFilter(triggerFilter === trigger ? null : trigger)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs transition-colors',
                      triggerFilter === trigger
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                        : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                    )}
                  >
                    {getTriggerDisplayName(trigger)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session list */}
      {filteredSessions.length > 0 ? (
        <div className="space-y-3">
          {filteredSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
            <History className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium mb-2">
            {hasActiveFilters ? 'No matching sessions' : 'No sessions yet'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {hasActiveFilters
              ? 'Try adjusting your filters or clear them to see all sessions.'
              : 'Complete a reset exercise to see your session history here.'}
          </p>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
