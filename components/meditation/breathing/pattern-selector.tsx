'use client';

import { motion } from 'motion/react';
import { BreathingPatternName, BREATHING_PATTERNS } from '@/types/meditation';
import { cn } from '@/lib/utils';

interface PatternSelectorProps {
  selectedPattern: BreathingPatternName;
  onSelect: (pattern: BreathingPatternName) => void;
  disabled?: boolean;
}

export function PatternSelector({ selectedPattern, onSelect, disabled }: PatternSelectorProps) {
  const patterns: BreathingPatternName[] = ['4-4-4-4', '4-7-8'];

  return (
    <div className="flex gap-3">
      {patterns.map((pattern) => {
        const config = BREATHING_PATTERNS[pattern];
        const isSelected = pattern === selectedPattern;

        return (
          <motion.button
            key={pattern}
            onClick={() => onSelect(pattern)}
            disabled={disabled}
            className={cn(
              'relative px-4 py-3 rounded-xl border transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isSelected
                ? 'border-cyan-500/50 bg-cyan-500/10'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            )}
            whileHover={!disabled ? { scale: 1.02 } : undefined}
            whileTap={!disabled ? { scale: 0.98 } : undefined}
          >
            <div className="text-center">
              <div className={cn(
                'font-mono text-lg font-bold mb-1',
                isSelected ? 'text-cyan-400' : 'text-foreground'
              )}>
                {pattern}
              </div>
              <div className="text-xs text-muted-foreground">
                {config.name}
              </div>
            </div>

            {isSelected && (
              <motion.div
                layoutId="pattern-indicator"
                className="absolute inset-0 rounded-xl border-2 border-cyan-400"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
