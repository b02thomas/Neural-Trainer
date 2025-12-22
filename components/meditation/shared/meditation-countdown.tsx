'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface MeditationCountdownProps {
  onComplete?: () => void;
}

export function MeditationCountdown({ onComplete }: MeditationCountdownProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (count === 0) {
      onComplete?.();
    }
  }, [count, onComplete]);

  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <AnimatePresence mode="wait">
        {count > 0 ? (
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <span className="text-8xl font-bold text-gradient-purple-cyan">
              {count}
            </span>

            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-24 h-24 rounded-full border-2 border-cyan-400" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="begin"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold text-cyan-400"
          >
            Begin
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
