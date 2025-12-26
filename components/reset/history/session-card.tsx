'use client';

import { motion } from 'motion/react';
import {
  Eye,
  HelpCircle,
  Wind,
  Dumbbell,
  Clock,
  ListChecks,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import { ResetSession, ResetType } from '@/types/reset';
import { getResetTypeDisplayName, getTriggerDisplayName } from '@/stores/reset-store';
import { cn } from '@/lib/utils';

const RESET_TYPE_ICONS: Record<ResetType, React.ElementType> = {
  grounding_sensory: Eye,
  grounding_questions: HelpCircle,
  breathing_quick: Wind,
  physical_reset: Dumbbell,
  perspective_shift: Clock,
  checklist: ListChecks,
  cooldown: Clock,
};

const RESET_TYPE_COLORS: Record<ResetType, { bg: string; text: string; border: string }> = {
  grounding_sensory: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  grounding_questions: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  breathing_quick: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  physical_reset: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  perspective_shift: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  checklist: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  cooldown: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
};

interface SessionCardProps {
  session: ResetSession;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }
  return `${minutes}m ${remainingSeconds}s`;
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}

function EmotionalIndicator({ before, after }: { before?: number; after?: number }) {
  if (before === undefined || after === undefined) {
    return null;
  }

  const improvement = after - before;
  let icon: React.ElementType;
  let color: string;
  let label: string;

  if (improvement > 0) {
    icon = ArrowUp;
    color = 'text-green-400';
    label = `+${improvement}`;
  } else if (improvement < 0) {
    icon = ArrowDown;
    color = 'text-red-400';
    label = `${improvement}`;
  } else {
    icon = Minus;
    color = 'text-muted-foreground';
    label = '0';
  }

  const Icon = icon;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{before}</span>
        <Icon className={cn('w-4 h-4', color)} />
        <span className={color}>{after}</span>
      </div>
      <div className={cn('text-xs px-2 py-0.5 rounded-full',
        improvement > 0 ? 'bg-green-500/20 text-green-400' :
        improvement < 0 ? 'bg-red-500/20 text-red-400' :
        'bg-white/10 text-muted-foreground'
      )}>
        {label}
      </div>
    </div>
  );
}

export function SessionCard({ session }: SessionCardProps) {
  const Icon = RESET_TYPE_ICONS[session.type];
  const colors = RESET_TYPE_COLORS[session.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass-card p-4 border transition-colors',
        colors.border
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn('p-2.5 rounded-lg', colors.bg)}>
          <Icon className={cn('w-5 h-5', colors.text)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-medium truncate">
              {getResetTypeDisplayName(session.type)}
            </h4>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatTimestamp(session.completedAt)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {/* Duration */}
            <span className="text-muted-foreground">
              {formatDuration(session.durationSeconds)}
            </span>

            {/* Trigger */}
            {session.trigger && (
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs',
                colors.bg,
                colors.text
              )}>
                {getTriggerDisplayName(session.trigger)}
              </span>
            )}
          </div>

          {/* Emotional states */}
          {(session.emotionalStateBefore !== undefined || session.emotionalStateAfter !== undefined) && (
            <div className="mt-2 pt-2 border-t border-white/5">
              <EmotionalIndicator
                before={session.emotionalStateBefore}
                after={session.emotionalStateAfter}
              />
            </div>
          )}

          {/* Notes */}
          {session.notes && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {session.notes}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
