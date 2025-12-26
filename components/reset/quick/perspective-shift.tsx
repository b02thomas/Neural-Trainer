'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ChevronRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { PERSPECTIVE_PROMPTS, PerspectivePrompt } from '@/types/reset';

interface PerspectiveShiftProps {
  onComplete: () => void;
}

const TIMEFRAME_CONFIG: Record<PerspectivePrompt['timeframe'], { color: string; bgColor: string; label: string }> = {
  week: { color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', label: '1 Week' },
  month: { color: 'text-purple-400', bgColor: 'bg-purple-500/10', label: '1 Month' },
  year: { color: 'text-amber-400', bgColor: 'bg-amber-500/10', label: '1 Year' },
  life: { color: 'text-green-400', bgColor: 'bg-green-500/10', label: 'Career' },
};

// Select 4 prompts for the exercise
function selectPrompts(): PerspectivePrompt[] {
  const shuffled = [...PERSPECTIVE_PROMPTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

export function PerspectiveShift({ onComplete }: PerspectiveShiftProps) {
  const [prompts] = useState(() => selectPrompts());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewed, setViewed] = useState<boolean[]>(Array(4).fill(false));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  const currentPrompt = prompts[currentIndex];
  const config = TIMEFRAME_CONFIG[currentPrompt.timeframe];
  const progress = ((currentIndex + (viewed[currentIndex] ? 1 : 0)) / prompts.length) * 100;

  // Reading timer - encourage at least 3 seconds per prompt
  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  useEffect(() => {
    setReadingTime(0);
  }, [currentIndex]);

  const handleNext = () => {
    if (isTransitioning) return;

    const newViewed = [...viewed];
    newViewed[currentIndex] = true;
    setViewed(newViewed);

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

  const canProceed = readingTime >= 3 || viewed[currentIndex];

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Prompt {currentIndex + 1} of {prompts.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Prompt indicators */}
      <div className="flex justify-center gap-3 mb-8">
        {prompts.map((p, index) => {
          const promptConfig = TIMEFRAME_CONFIG[p.timeframe];
          const isViewed = viewed[index];
          const isCurrent = index === currentIndex;

          return (
            <div
              key={p.id}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                isViewed
                  ? 'bg-green-500/20 border-2 border-green-500/50'
                  : isCurrent
                    ? `${promptConfig.bgColor} border-2 ${promptConfig.color.replace('text-', 'border-')}/50`
                    : 'bg-white/5 border-2 border-white/10'
              )}
            >
              {isViewed ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Clock
                  className={cn(
                    'w-5 h-5',
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          {/* Timeframe badge */}
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6',
              config.bgColor,
              config.color
            )}
          >
            <Clock className="w-3 h-3" />
            {config.label} from now
          </div>

          {/* Main prompt card */}
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className={cn(
              'glass-card p-8 mb-8 border-2',
              config.color.replace('text-', 'border-').replace('-400', '-500/30')
            )}
          >
            <Sparkles className={cn('w-8 h-8 mx-auto mb-4', config.color)} />
            <h2 className="text-2xl font-medium leading-relaxed">
              {currentPrompt.prompt}
            </h2>
          </motion.div>

          {/* Reading indicator */}
          {!canProceed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-sm text-muted-foreground"
            >
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      'w-2 h-2 rounded-full transition-colors',
                      readingTime >= i ? config.bgColor.replace('/10', '/50') : 'bg-white/10'
                    )}
                    animate={{ scale: readingTime === i - 1 ? [1, 1.3, 1] : 1 }}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </div>
              Take a moment to reflect...
            </motion.div>
          )}

          {/* Action button */}
          <Button
            onClick={handleNext}
            disabled={isTransitioning || !canProceed}
            className={cn(
              'min-w-[200px] transition-all',
              currentIndex === prompts.length - 1 ? 'glow-green' : 'glow-purple'
            )}
          >
            {currentIndex === prompts.length - 1 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Complete
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </motion.div>
      </AnimatePresence>

      {/* Breathing reminder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10"
      >
        <p className="text-sm text-muted-foreground text-center">
          <span className="text-foreground font-medium">Breathe:</span>{' '}
          Take a deep breath as you read each prompt. Let the perspective sink in.
        </p>
      </motion.div>
    </div>
  );
}

// Compact single-card version
export function PerspectiveShiftCompact({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [prompts] = useState(() => selectPrompts().slice(0, 2));
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < prompts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const currentPrompt = prompts[currentIndex];
  const config = TIMEFRAME_CONFIG[currentPrompt.timeframe];

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
      <div className={cn('p-3 rounded-lg', config.bgColor)}>
        <Clock className={cn('w-6 h-6', config.color)} />
      </div>
      <div className="flex-1">
        <div className="font-medium text-sm">{currentPrompt.prompt}</div>
        <div className="text-xs text-muted-foreground mt-1">
          Prompt {currentIndex + 1} of {prompts.length}
        </div>
      </div>
      <Button size="sm" onClick={handleNext}>
        {currentIndex === prompts.length - 1 ? 'Done' : 'Next'}
      </Button>
    </div>
  );
}
