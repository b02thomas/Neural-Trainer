'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowUp, ArrowDown, Minus, CheckCircle, RefreshCw, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmotionalScaleDisplay } from '../assessment/emotional-scale';
import { TriggerBadge } from '../assessment/trigger-selector';
import { cn } from '@/lib/utils';
import { ResetType, TriggerType } from '@/types/reset';
import { getResetTypeDisplayName } from '@/stores/reset-store';

interface SessionCompleteProps {
  resetType: ResetType;
  trigger?: TriggerType;
  emotionalStateBefore: number;
  emotionalStateAfter: number;
  durationSeconds: number;
  onAddNotes?: (notes: string) => void;
  onComplete: () => void;
}

export function SessionComplete({
  resetType,
  trigger,
  emotionalStateBefore,
  emotionalStateAfter,
  durationSeconds,
  onAddNotes,
  onComplete,
}: SessionCompleteProps) {
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const improvement = emotionalStateAfter - emotionalStateBefore;
  const improvementLabel =
    improvement > 0
      ? `+${improvement} improvement`
      : improvement < 0
        ? `${improvement} change`
        : 'No change';

  const ImprovementIcon =
    improvement > 0 ? ArrowUp : improvement < 0 ? ArrowDown : Minus;

  const improvementColor =
    improvement > 0
      ? 'text-green-400'
      : improvement < 0
        ? 'text-red-400'
        : 'text-muted-foreground';

  const handleComplete = () => {
    if (notes && onAddNotes) {
      onAddNotes(notes);
    }
    onComplete();
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-card p-6 border border-green-500/20">
        {/* Success header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-400" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-1">Reset Complete</h2>
          <p className="text-muted-foreground">
            {getResetTypeDisplayName(resetType)} · {formatDuration(durationSeconds)}
          </p>
          {trigger && (
            <div className="mt-2">
              <TriggerBadge trigger={trigger} />
            </div>
          )}
        </div>

        {/* Before/After comparison */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-card p-4 border border-white/10">
            <EmotionalScaleDisplay
              value={emotionalStateBefore}
              label="Before"
              size="sm"
            />
          </div>
          <div className="glass-card p-4 border border-white/10">
            <EmotionalScaleDisplay
              value={emotionalStateAfter}
              label="After"
              size="sm"
            />
          </div>
        </div>

        {/* Improvement indicator */}
        <div
          className={cn(
            'flex items-center justify-center gap-2 p-3 rounded-lg mb-6',
            improvement > 0
              ? 'bg-green-500/10'
              : improvement < 0
                ? 'bg-red-500/10'
                : 'bg-white/5'
          )}
        >
          <ImprovementIcon className={cn('w-5 h-5', improvementColor)} />
          <span className={cn('font-medium', improvementColor)}>
            {improvementLabel}
          </span>
        </div>

        {/* Notes section */}
        {onAddNotes && (
          <div className="mb-6">
            {showNotes ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block text-sm font-medium mb-2">
                  Add notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What did you learn? Any insights?"
                  className="w-full h-24 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none resize-none text-sm"
                />
              </motion.div>
            ) : (
              <button
                onClick={() => setShowNotes(true)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Add notes
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button onClick={handleComplete} className="w-full glow-green">
            <CheckCircle className="w-4 h-4 mr-2" />
            Done
          </Button>

          <Link href="/reset" className="block">
            <Button variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Return to Reset Hub
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Simple completion message for quick resets
export function QuickCompleteMessage({ message }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        className="text-6xl mb-4"
      >
        ✨
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">
        {message || 'Great job taking a moment to reset!'}
      </h3>
      <p className="text-muted-foreground">
        You&apos;re now ready to return with clarity.
      </p>
    </motion.div>
  );
}
