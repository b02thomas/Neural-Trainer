'use client';

import { motion, AnimatePresence } from 'motion/react';
import { BreathingPhase, PHASE_CONFIGS } from '@/types/meditation';

interface PhaseIndicatorProps {
  phase: BreathingPhase;
  cycleCount: number;
}

export function PhaseIndicator({ phase, cycleCount }: PhaseIndicatorProps) {
  const config = PHASE_CONFIGS[phase];

  return (
    <div className="text-center space-y-4">
      {/* Phase text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <p
            className="text-2xl font-medium"
            style={{ color: config.color }}
          >
            {config.prompt}
          </p>
          <p className="text-sm text-muted-foreground">
            {config.promptDe}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Cycle counter */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>Cycle</span>
        <span
          className="font-mono font-bold text-lg"
          style={{ color: config.color }}
        >
          {cycleCount}
        </span>
      </div>
    </div>
  );
}
