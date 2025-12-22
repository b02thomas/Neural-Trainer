'use client';

import { motion } from 'motion/react';
import { Bell, BellOff } from 'lucide-react';
import { ChimeInterval, CHIME_INTERVALS } from '@/types/meditation';

interface ChimeSelectorProps {
  selectedInterval: ChimeInterval;
  onSelect: (interval: ChimeInterval) => void;
  disabled?: boolean;
}

const INTERVAL_LABELS: Record<ChimeInterval, string> = {
  0: 'Aus',
  30: '30s',
  60: '1 min',
  120: '2 min',
};

const INTERVAL_DESCRIPTIONS: Record<ChimeInterval, string> = {
  0: 'Keine Glocke',
  30: 'Alle 30 Sekunden',
  60: 'Jede Minute',
  120: 'Alle 2 Minuten',
};

export function ChimeSelector({ selectedInterval, onSelect, disabled }: ChimeSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {CHIME_INTERVALS.map((interval) => {
        const isSelected = interval === selectedInterval;
        const isOff = interval === 0;

        return (
          <motion.button
            key={interval}
            onClick={() => !disabled && onSelect(interval)}
            disabled={disabled}
            className={`relative p-3 rounded-xl border transition-all ${
              disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer hover:scale-105'
            } ${
              isSelected
                ? 'bg-green-500/20 border-green-500/50'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
            whileHover={disabled ? {} : { scale: 1.02 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
          >
            {/* Icon */}
            <div className="flex justify-center mb-1">
              {isOff ? (
                <BellOff className={`w-5 h-5 ${isSelected ? 'text-green-400' : 'text-muted-foreground'}`} />
              ) : (
                <Bell className={`w-5 h-5 ${isSelected ? 'text-green-400' : 'text-muted-foreground'}`} />
              )}
            </div>

            {/* Label */}
            <div className={`text-sm font-medium ${isSelected ? 'text-green-400' : 'text-foreground'}`}>
              {INTERVAL_LABELS[interval]}
            </div>

            {/* Selected indicator */}
            {isSelected && (
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-green-500"
                layoutId="chime-selected"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// Also export a compact tooltip version for displaying during session
export function ChimeIndicator({ interval }: { interval: ChimeInterval }) {
  if (interval === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Bell className="w-4 h-4 text-green-400" />
      <span>{INTERVAL_DESCRIPTIONS[interval]}</span>
    </div>
  );
}
