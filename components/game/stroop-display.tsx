import { StroopChallenge } from '@/types/game';
import { getColor } from '@/lib/colors';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface StroopDisplayProps {
  challenge: StroopChallenge | null;
  className?: string;
}

export function StroopDisplay({ challenge, className }: StroopDisplayProps) {
  if (!challenge) {
    return (
      <div className={cn("flex items-center justify-center min-h-[200px]", className)}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-white/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 status-indicator" />
          </div>
          <p className="text-white/40 text-sm uppercase tracking-widest">
            Awaiting Input
          </p>
        </div>
      </div>
    );
  }

  const colorConfig = getColor(challenge.inkColor);

  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-[200px] relative",
        className
      )}
      role="presentation"
      aria-label={`The word "${getColor(challenge.word).displayName}" in ${colorConfig.displayName} color`}
    >
      {/* Scanning Effect */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-cyan-500/5 animate-scan-line" />
      </div>

      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-500/50 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-500/50 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg" />

      <AnimatePresence mode="wait">
        <motion.div
          key={challenge.id}
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          transition={{
            duration: 0.3,
            ease: 'easeOut'
          }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider select-none"
          style={{
            color: colorConfig.hexValue,
            textShadow: `0 0 30px ${colorConfig.hexValue}40, 0 0 60px ${colorConfig.hexValue}20`
          }}
        >
          {getColor(challenge.word).displayName.toUpperCase()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
