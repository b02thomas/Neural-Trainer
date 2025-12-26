'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface EmotionalScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
}

const SCALE_CONFIG = [
  { value: 1, emoji: '😰', label: 'Distressed', color: 'bg-red-500' },
  { value: 2, emoji: '😟', label: 'Very upset', color: 'bg-red-400' },
  { value: 3, emoji: '😕', label: 'Upset', color: 'bg-orange-500' },
  { value: 4, emoji: '😐', label: 'Uneasy', color: 'bg-orange-400' },
  { value: 5, emoji: '😶', label: 'Neutral', color: 'bg-yellow-500' },
  { value: 6, emoji: '🙂', label: 'Okay', color: 'bg-yellow-400' },
  { value: 7, emoji: '😊', label: 'Good', color: 'bg-lime-500' },
  { value: 8, emoji: '😌', label: 'Calm', color: 'bg-green-400' },
  { value: 9, emoji: '😄', label: 'Great', color: 'bg-green-500' },
  { value: 10, emoji: '🧘', label: 'Focused', color: 'bg-emerald-500' },
];

export function EmotionalScale({
  value,
  onChange,
  label = 'How are you feeling right now?',
  disabled = false,
}: EmotionalScaleProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const displayValue = hoveredValue ?? value;
  const config = displayValue ? SCALE_CONFIG[displayValue - 1] : null;

  return (
    <div className="w-full max-w-md mx-auto">
      <label className="block text-center text-lg font-medium mb-6">
        {label}
      </label>

      {/* Emoji display */}
      <div className="text-center mb-6">
        <motion.div
          key={displayValue || 'empty'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl mb-2"
        >
          {config?.emoji || '🤔'}
        </motion.div>
        <p className="text-muted-foreground">
          {config?.label || 'Select your emotional state'}
        </p>
      </div>

      {/* Scale buttons */}
      <div className="flex justify-center gap-1 sm:gap-2 mb-4">
        {SCALE_CONFIG.map((item) => (
          <button
            key={item.value}
            onClick={() => !disabled && onChange(item.value)}
            onMouseEnter={() => !disabled && setHoveredValue(item.value)}
            onMouseLeave={() => setHoveredValue(null)}
            disabled={disabled}
            className={cn(
              'w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-all duration-200 text-sm font-medium',
              'border-2',
              value === item.value
                ? `${item.color} border-white text-white scale-110`
                : 'bg-white/5 border-white/10 hover:border-white/30',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {item.value}
          </button>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>Distressed</span>
        <span>Calm & Focused</span>
      </div>

      {/* Selected value indicator */}
      {value && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4"
        >
          <span className="text-sm text-muted-foreground">
            Selected: <span className="text-foreground font-medium">{value}/10</span>
          </span>
        </motion.div>
      )}
    </div>
  );
}

// Compact version for inline use
export function EmotionalScaleCompact({
  value,
  onChange,
  disabled = false,
}: Omit<EmotionalScaleProps, 'label'>) {
  const config = value ? SCALE_CONFIG[value - 1] : null;

  return (
    <div className="flex items-center gap-3">
      <div className="text-2xl">{config?.emoji || '🤔'}</div>
      <div className="flex gap-1">
        {SCALE_CONFIG.map((item) => (
          <button
            key={item.value}
            onClick={() => !disabled && onChange(item.value)}
            disabled={disabled}
            className={cn(
              'w-6 h-6 rounded transition-all duration-150 text-xs font-medium',
              value === item.value
                ? `${item.color} text-white`
                : 'bg-white/5 hover:bg-white/10',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {item.value}
          </button>
        ))}
      </div>
      {config && (
        <span className="text-sm text-muted-foreground">{config.label}</span>
      )}
    </div>
  );
}

// Display only version for showing results
export function EmotionalScaleDisplay({
  value,
  label,
  size = 'md',
}: {
  value: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const config = SCALE_CONFIG[value - 1];

  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <div className="text-center">
      {label && (
        <p className="text-sm text-muted-foreground mb-2">{label}</p>
      )}
      <div className={sizes[size]}>{config.emoji}</div>
      <div className="mt-1">
        <span className={cn('font-bold', config.color.replace('bg-', 'text-'))}>
          {value}/10
        </span>
        <span className="text-muted-foreground ml-2">{config.label}</span>
      </div>
    </div>
  );
}
