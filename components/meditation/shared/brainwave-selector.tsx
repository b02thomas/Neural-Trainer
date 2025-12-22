'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Headphones, Waves, WavesLadder } from 'lucide-react';
import { BrainwaveType, BRAINWAVE_CONFIGS } from '@/types/meditation';
import { cn } from '@/lib/utils';

interface BrainwaveSelectorProps {
  selectedBrainwave: BrainwaveType;
  onSelect: (type: BrainwaveType) => void;
  disabled?: boolean;
}

const BRAINWAVE_OPTIONS: { type: BrainwaveType; label: string; icon: typeof Waves }[] = [
  { type: 'off', label: 'Aus', icon: Waves },
  { type: 'alpha', label: 'Alpha', icon: Waves },
  { type: 'theta', label: 'Theta', icon: WavesLadder },
];

export function BrainwaveSelector({ selectedBrainwave, onSelect, disabled }: BrainwaveSelectorProps) {
  const [showWarning, setShowWarning] = useState(false);

  const handleSelect = (type: BrainwaveType) => {
    onSelect(type);

    // Show headphone warning when selecting a brainwave type
    if (type !== 'off') {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 4000);
    } else {
      setShowWarning(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap justify-center">
        {BRAINWAVE_OPTIONS.map(({ type, label, icon: Icon }) => {
          const isSelected = type === selectedBrainwave;
          const config = type !== 'off' ? BRAINWAVE_CONFIGS[type] : null;

          return (
            <motion.button
              key={type}
              onClick={() => handleSelect(type)}
              disabled={disabled}
              className={cn(
                'relative px-4 py-2 rounded-lg border transition-all duration-200 min-w-[80px]',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                isSelected
                  ? 'border-cyan-500/50 bg-cyan-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              )}
              whileHover={!disabled ? { scale: 1.05 } : undefined}
              whileTap={!disabled ? { scale: 0.95 } : undefined}
            >
              <div className="flex items-center gap-2 justify-center">
                <Icon className={cn(
                  'w-4 h-4',
                  isSelected ? 'text-cyan-400' : 'text-muted-foreground'
                )} />
                <span className={cn(
                  'font-medium',
                  isSelected ? 'text-cyan-400' : 'text-foreground'
                )}>
                  {label}
                </span>
              </div>

              {config && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  {config.beatFrequency} Hz
                </div>
              )}

              {isSelected && (
                <motion.div
                  layoutId="brainwave-indicator"
                  className="absolute inset-0 rounded-lg border-2 border-cyan-400"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Headphone warning */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-2 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2"
          >
            <Headphones className="w-4 h-4" />
            <span>Kopfhörer empfohlen für binaural beats</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description of selected brainwave */}
      <AnimatePresence mode="wait">
        {selectedBrainwave !== 'off' && (
          <motion.p
            key={selectedBrainwave}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-muted-foreground text-center"
          >
            {BRAINWAVE_CONFIGS[selectedBrainwave].descriptionDe}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
