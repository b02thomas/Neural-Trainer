'use client';

import { motion } from 'motion/react';
import { SessionDuration, SESSION_DURATIONS } from '@/types/meditation';
import { cn } from '@/lib/utils';

interface SessionSelectorProps {
  selectedDuration: SessionDuration;
  onSelect: (duration: SessionDuration) => void;
  disabled?: boolean;
}

export function SessionSelector({ selectedDuration, onSelect, disabled }: SessionSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {SESSION_DURATIONS.map((duration) => {
        const isSelected = duration === selectedDuration;

        return (
          <motion.button
            key={duration}
            onClick={() => onSelect(duration)}
            disabled={disabled}
            className={cn(
              'relative px-4 py-2 rounded-lg border transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isSelected
                ? 'border-purple-500/50 bg-purple-500/10'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            )}
            whileHover={!disabled ? { scale: 1.05 } : undefined}
            whileTap={!disabled ? { scale: 0.95 } : undefined}
          >
            <span className={cn(
              'font-mono font-medium',
              isSelected ? 'text-purple-400' : 'text-foreground'
            )}>
              {duration}
            </span>
            <span className="text-xs text-muted-foreground ml-1">min</span>

            {isSelected && (
              <motion.div
                layoutId="duration-indicator"
                className="absolute inset-0 rounded-lg border-2 border-purple-400"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
