'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Pause, Play, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CooldownDuration } from '@/types/reset';

interface CooldownTimerProps {
  duration: CooldownDuration;
  onComplete: () => void;
  onCancel: () => void;
  isPaused?: boolean;
  onPauseToggle?: () => void;
}

export function CooldownTimer({
  duration,
  onComplete,
  onCancel,
}: CooldownTimerProps) {
  const totalSeconds = duration * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, remainingSeconds, onComplete]);

  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div className="w-full max-w-md mx-auto text-center">
      {/* Timer circle */}
      <div className="relative w-80 h-80 mx-auto mb-8">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-white/10"
          />
          {/* Progress circle */}
          <motion.circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-amber-400"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl font-bold text-amber-400 mb-2">
            {formatTime(remainingSeconds)}
          </div>
          <div className="text-muted-foreground">
            {isPaused ? 'Paused' : 'Remaining'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          className="w-14 h-14 rounded-full"
          onClick={onCancel}
        >
          <X className="w-6 h-6" />
        </Button>

        <Button
          size="icon"
          className="w-16 h-16 rounded-full bg-amber-500/20 hover:bg-amber-500/30"
          onClick={togglePause}
        >
          {isPaused ? (
            <Play className="w-7 h-7 text-amber-400 ml-1" />
          ) : (
            <Pause className="w-7 h-7 text-amber-400" />
          )}
        </Button>

        {remainingSeconds > 0 && (
          <Button
            variant="outline"
            size="icon"
            className="w-14 h-14 rounded-full text-green-400 hover:text-green-300"
            onClick={onComplete}
            title="Complete early"
          >
            <Check className="w-6 h-6" />
          </Button>
        )}
      </div>

      {/* Progress text */}
      <div className="text-sm text-muted-foreground">
        {Math.round(progress)}% complete
      </div>
    </div>
  );
}
