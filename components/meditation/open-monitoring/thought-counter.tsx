'use client';

import { motion } from 'motion/react';
import { Brain } from 'lucide-react';

interface ThoughtCounterProps {
  count: number;
  onTap: () => void;
  disabled?: boolean;
}

export function ThoughtCounter({ count, onTap, disabled }: ThoughtCounterProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Counter display */}
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-1">Gedanken bemerkt</div>
        <motion.div
          key={count}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-bold text-green-400"
        >
          {count}
        </motion.div>
      </div>

      {/* Tap button */}
      <motion.button
        onClick={onTap}
        disabled={disabled}
        className={`relative p-8 rounded-full transition-all ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-white/5'
            : 'cursor-pointer bg-green-500/10 border-2 border-green-500/30 hover:border-green-500/50 active:scale-95'
        }`}
        whileHover={disabled ? {} : { scale: 1.05 }}
        whileTap={disabled ? {} : { scale: 0.9 }}
      >
        <Brain className="w-12 h-12 text-green-400" />

        {/* Pulse effect on tap */}
        <motion.div
          key={`pulse-${count}`}
          className="absolute inset-0 rounded-full border-2 border-green-500"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </motion.button>

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        Tippe, wenn du einen Gedanken oder eine Ablenkung bemerkst.
        <br />
        Lass ihn dann sanft los und kehre zur Stille zurück.
      </p>
    </div>
  );
}
