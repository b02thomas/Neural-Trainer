'use client';

import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CooldownDuration, COOLDOWN_DURATIONS } from '@/types/reset';

interface DurationSelectorProps {
  value: CooldownDuration;
  onChange: (duration: CooldownDuration) => void;
}

const DURATION_LABELS: Record<CooldownDuration, { label: string; description: string }> = {
  5: { label: '5 min', description: 'Quick break' },
  15: { label: '15 min', description: 'Short cooldown' },
  30: { label: '30 min', description: 'Standard reset' },
  60: { label: '1 hour', description: 'Full recovery' },
};

export function DurationSelector({ value, onChange }: DurationSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium mb-1">Select Cooldown Duration</h3>
        <p className="text-sm text-muted-foreground">
          How long do you need before your next trade?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {COOLDOWN_DURATIONS.map((duration) => {
          const config = DURATION_LABELS[duration];
          const isSelected = value === duration;

          return (
            <motion.button
              key={duration}
              onClick={() => onChange(duration)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'p-4 rounded-lg border-2 text-left transition-all',
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/50'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    isSelected ? 'bg-amber-500/20' : 'bg-white/5'
                  )}
                >
                  <Clock
                    className={cn(
                      'w-5 h-5',
                      isSelected ? 'text-amber-400' : 'text-muted-foreground'
                    )}
                  />
                </div>
                <div>
                  <div
                    className={cn(
                      'font-bold',
                      isSelected ? 'text-amber-400' : 'text-foreground'
                    )}
                  >
                    {config.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {config.description}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
