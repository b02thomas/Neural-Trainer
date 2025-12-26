'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye,
  Dumbbell,
  Activity,
  Droplets,
  Footprints,
  ChevronRight,
  Check,
  RotateCcw,
  Play,
  Pause,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { PHYSICAL_RESET_PROMPTS, PhysicalResetPrompt, PhysicalResetType } from '@/types/reset';

interface PhysicalResetProps {
  onComplete: () => void;
}

const TYPE_CONFIG: Record<PhysicalResetType, { icon: React.ElementType; color: string; bgColor: string }> = {
  eye_break: { icon: Eye, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
  stretch: { icon: Dumbbell, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  breathing: { icon: Activity, color: 'text-green-400', bgColor: 'bg-green-500/10' },
  hydrate: { icon: Droplets, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  walk: { icon: Footprints, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
};

// Select 2-3 prompts for a quick reset
function selectPrompts(): PhysicalResetPrompt[] {
  const shuffled = [...PHYSICAL_RESET_PROMPTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

export function PhysicalReset({ onComplete }: PhysicalResetProps) {
  const [prompts] = useState(() => selectPrompts());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(Array(3).fill(false));
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentPrompt = prompts[currentIndex];
  const config = TYPE_CONFIG[currentPrompt.type];
  const Icon = config.icon;
  const progress = ((currentIndex + (completed[currentIndex] ? 1 : 0)) / prompts.length) * 100;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const startTimer = useCallback(() => {
    setTimeRemaining(currentPrompt.durationSeconds);
    setIsRunning(true);
  }, [currentPrompt.durationSeconds]);

  const resetTimer = useCallback(() => {
    setTimeRemaining(currentPrompt.durationSeconds);
    setIsRunning(false);
  }, [currentPrompt.durationSeconds]);

  const toggleTimer = useCallback(() => {
    if (!isRunning && timeRemaining === 0) {
      startTimer();
    } else {
      setIsRunning(!isRunning);
    }
  }, [isRunning, timeRemaining, startTimer]);

  // Initialize timer for current prompt
  useEffect(() => {
    setTimeRemaining(currentPrompt.durationSeconds);
    setIsRunning(false);
  }, [currentPrompt.durationSeconds, currentIndex]);

  const handleComplete = () => {
    if (isTransitioning) return;

    const newCompleted = [...completed];
    newCompleted[currentIndex] = true;
    setCompleted(newCompleted);

    if (currentIndex < prompts.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 400);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    if (isTransitioning) return;

    if (currentIndex < prompts.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      onComplete();
    }
  };

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  const timerProgress = currentPrompt.durationSeconds > 0
    ? ((currentPrompt.durationSeconds - timeRemaining) / currentPrompt.durationSeconds) * 100
    : 0;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Exercise {currentIndex + 1} of {prompts.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Exercise indicators */}
      <div className="flex justify-center gap-3 mb-8">
        {prompts.map((p, index) => {
          const promptConfig = TYPE_CONFIG[p.type];
          const PromptIcon = promptConfig.icon;
          const isCompleted = completed[index];
          const isCurrent = index === currentIndex;

          return (
            <div
              key={p.id}
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300',
                isCompleted
                  ? 'bg-green-500/20 border-2 border-green-500/50'
                  : isCurrent
                    ? `${promptConfig.bgColor} border-2 ${promptConfig.color.replace('text-', 'border-')}/50`
                    : 'bg-white/5 border-2 border-white/10'
              )}
            >
              {isCompleted ? (
                <Check className="w-6 h-6 text-green-400" />
              ) : (
                <PromptIcon
                  className={cn(
                    'w-6 h-6',
                    isCurrent ? promptConfig.color : 'text-muted-foreground'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          {/* Type badge */}
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6',
              config.bgColor,
              config.color
            )}
          >
            <Icon className="w-3 h-3" />
            {currentPrompt.type === 'eye_break' && 'Eye Break'}
            {currentPrompt.type === 'stretch' && 'Stretch'}
            {currentPrompt.type === 'breathing' && 'Breathing'}
            {currentPrompt.type === 'hydrate' && 'Hydrate'}
            {currentPrompt.type === 'walk' && 'Movement'}
          </div>

          {/* Timer circle */}
          <motion.div
            className="relative w-48 h-48 mx-auto mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-white/10"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - timerProgress / 100)}
                strokeLinecap="round"
                className={config.color}
                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - timerProgress / 100) }}
                transition={{ duration: 0.5 }}
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Icon className={cn('w-12 h-12 mb-2', config.color)} />
              <div className={cn('text-3xl font-bold', config.color)}>
                {formatTime(timeRemaining)}
              </div>
            </div>
          </motion.div>

          {/* Prompt text */}
          <h2 className="text-xl font-medium mb-6 leading-relaxed">
            {currentPrompt.prompt}
          </h2>

          {/* Timer controls */}
          <div className="flex justify-center gap-3 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={resetTimer}
              className="w-12 h-12 rounded-full"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button
              onClick={toggleTimer}
              size="icon"
              className={cn('w-14 h-14 rounded-full', config.bgColor.replace('/10', '/20'))}
            >
              {isRunning ? (
                <Pause className={cn('w-6 h-6', config.color)} />
              ) : (
                <Play className={cn('w-6 h-6 ml-1', config.color)} />
              )}
            </Button>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-3">
            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={isTransitioning}
              className="opacity-70 hover:opacity-100"
            >
              Skip
            </Button>
            <Button
              onClick={handleComplete}
              disabled={isTransitioning}
              className={cn(
                'min-w-[150px]',
                currentIndex === prompts.length - 1 ? 'glow-green' : ''
              )}
            >
              {currentIndex === prompts.length - 1 ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Complete
                </>
              ) : (
                <>
                  Done
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10"
      >
        <p className="text-sm text-muted-foreground text-center">
          <span className="text-foreground font-medium">Tip:</span>{' '}
          {currentPrompt.type === 'eye_break' &&
            'Look at a distant object to relax your eye muscles.'}
          {currentPrompt.type === 'stretch' &&
            'Move slowly and don\'t push beyond comfortable range.'}
          {currentPrompt.type === 'breathing' &&
            'Focus on making the exhale longer than the inhale.'}
          {currentPrompt.type === 'hydrate' &&
            'Proper hydration improves cognitive function.'}
          {currentPrompt.type === 'walk' &&
            'Even a few steps can reset your mental state.'}
        </p>
      </motion.div>
    </div>
  );
}

// Compact version
export function PhysicalResetCompact({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [prompt] = useState(() => PHYSICAL_RESET_PROMPTS[Math.floor(Math.random() * PHYSICAL_RESET_PROMPTS.length)]);
  const [timeRemaining, setTimeRemaining] = useState(prompt.durationSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, onComplete]);

  const config = TYPE_CONFIG[prompt.type];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
      <div className={cn('p-3 rounded-lg', config.bgColor)}>
        <Icon className={cn('w-6 h-6', config.color)} />
      </div>
      <div className="flex-1">
        <div className="font-medium text-sm">{prompt.prompt}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {timeRemaining}s remaining
        </div>
      </div>
      <Button
        size="sm"
        onClick={() => setIsRunning(!isRunning)}
      >
        {isRunning ? 'Pause' : 'Start'}
      </Button>
    </div>
  );
}
