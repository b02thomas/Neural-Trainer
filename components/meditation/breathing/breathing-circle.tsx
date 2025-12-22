'use client';

import { motion } from 'motion/react';
import { BreathingPhase, PHASE_CONFIGS } from '@/types/meditation';

interface BreathingCircleProps {
  phase: BreathingPhase;
  progress: number;
  size?: number;
}

export function BreathingCircle({ phase, progress, size = 280 }: BreathingCircleProps) {
  const config = PHASE_CONFIGS[phase];

  // Scale based on phase
  const getScale = () => {
    switch (phase) {
      case 'inhale':
        return 0.6 + 0.4 * progress;  // 0.6 -> 1.0
      case 'hold-in':
        return 1.0;                    // stay at 1.0
      case 'exhale':
        return 1.0 - 0.4 * progress;  // 1.0 -> 0.6
      case 'hold-out':
        return 0.6;                    // stay at 0.6
      default:
        return 0.6;
    }
  };

  const scale = getScale();

  // Progress ring dimensions
  const strokeWidth = 4;
  const radius = (size / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10"
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={config.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ filter: `drop-shadow(0 0 8px ${config.color}40)` }}
        />
      </svg>

      {/* Main breathing circle */}
      <motion.div
        className="rounded-full"
        animate={{
          scale,
        }}
        transition={{
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.1,
        }}
        style={{
          width: size * 0.7,
          height: size * 0.7,
          background: `radial-gradient(circle at 30% 30%, ${config.color}40, ${config.color}10)`,
          boxShadow: `
            0 0 60px ${config.color}30,
            0 0 100px ${config.color}20,
            inset 0 0 60px ${config.color}10
          `,
          border: `2px solid ${config.color}50`,
        }}
      />

      {/* Inner glow pulse */}
      <motion.div
        className="absolute rounded-full"
        animate={{
          scale: [0.8, 0.9, 0.8],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut',
        }}
        style={{
          width: size * 0.4,
          height: size * 0.4,
          background: `radial-gradient(circle, ${config.color}60, transparent)`,
        }}
      />
    </div>
  );
}
