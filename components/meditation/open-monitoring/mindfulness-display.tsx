'use client';

import { motion } from 'motion/react';
import { Bell } from 'lucide-react';
import { ChimeInterval } from '@/types/meditation';

interface MindfulnessDisplayProps {
  remainingMs: number;
  chimeInterval: ChimeInterval;
  elapsedMs: number;
}

export function MindfulnessDisplay({ remainingMs, chimeInterval, elapsedMs }: MindfulnessDisplayProps) {
  // Format remaining time
  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Calculate next chime time
  const getNextChimeIn = () => {
    if (chimeInterval === 0) return null;
    const chimeIntervalMs = chimeInterval * 1000;
    const timeSinceLastChime = elapsedMs % chimeIntervalMs;
    const timeUntilNextChime = chimeIntervalMs - timeSinceLastChime;
    return Math.ceil(timeUntilNextChime / 1000);
  };

  const nextChimeIn = getNextChimeIn();

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Breathing reminder - subtle pulsing circle */}
      <motion.div
        className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        }}
      />

      {/* Large timer display */}
      <div className="text-center">
        <div className="font-mono text-6xl md:text-7xl font-light text-foreground tracking-wider">
          {timeString}
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          verbleibend
        </div>
      </div>

      {/* Next chime indicator */}
      {chimeInterval > 0 && nextChimeIn && nextChimeIn <= 10 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-green-400"
        >
          <Bell className="w-4 h-4" />
          <span>Glocke in {nextChimeIn}s</span>
        </motion.div>
      )}

      {/* Subtle instruction */}
      <p className="text-xs text-muted-foreground/50 text-center max-w-sm">
        Beobachte deinen Atem und deine Gedanken.
        <br />
        Ohne zu urteilen. Einfach wahrnehmen.
      </p>
    </div>
  );
}
