'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Hand, Ear, Wind, Utensils, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { GROUNDING_STEPS, GroundingStep } from '@/types/reset';

interface GroundingExerciseProps {
  onComplete: () => void;
  onStepChange?: (step: number) => void;
}

const STEP_ICONS: Record<GroundingStep, React.ElementType> = {
  see: Eye,
  touch: Hand,
  hear: Ear,
  smell: Wind,
  taste: Utensils,
};

const STEP_COLORS: Record<GroundingStep, { bg: string; text: string; border: string }> = {
  see: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  touch: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  hear: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  smell: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  taste: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' },
};

export function GroundingExercise({ onComplete, onStepChange }: GroundingExerciseProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(Array(5).fill(false));
  const [isTransitioning, setIsTransitioning] = useState(false);

  const step = GROUNDING_STEPS[currentStep];
  const Icon = STEP_ICONS[step.step];
  const colors = STEP_COLORS[step.step];
  const progress = ((currentStep + (completed[currentStep] ? 1 : 0)) / 5) * 100;

  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const handleStepComplete = () => {
    if (isTransitioning) return;

    const newCompleted = [...completed];
    newCompleted[currentStep] = true;
    setCompleted(newCompleted);

    if (currentStep < 4) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsTransitioning(false);
      }, 500);
    } else {
      onComplete();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Step {currentStep + 1} of 5</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step indicators */}
      <div className="flex justify-center gap-2 mb-8">
        {GROUNDING_STEPS.map((s, index) => {
          const StepIcon = STEP_ICONS[s.step];
          const stepColors = STEP_COLORS[s.step];
          const isComplete = completed[index];
          const isCurrent = index === currentStep;

          return (
            <div
              key={s.step}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                isComplete
                  ? 'bg-green-500/20 border-2 border-green-500/50'
                  : isCurrent
                    ? `${stepColors.bg} border-2 ${stepColors.border}`
                    : 'bg-white/5 border-2 border-white/10'
              )}
            >
              {isComplete ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <StepIcon
                  className={cn(
                    'w-5 h-5',
                    isCurrent ? stepColors.text : 'text-muted-foreground'
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
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={cn(
              'inline-flex items-center justify-center w-24 h-24 rounded-full mb-6',
              colors.bg
            )}
          >
            <Icon className={cn('w-12 h-12', colors.text)} />
          </motion.div>

          {/* Count */}
          <div className={cn('text-6xl font-bold mb-4', colors.text)}>
            {step.count}
          </div>

          {/* Prompt */}
          <h2 className="text-xl font-medium mb-2">{step.prompt}</h2>
          <p className="text-muted-foreground mb-8">
            Take your time to notice each one
          </p>

          {/* Action button */}
          <Button
            onClick={handleStepComplete}
            disabled={isTransitioning}
            className={cn('min-w-[200px]', currentStep === 4 ? 'glow-green' : 'glow-purple')}
          >
            {currentStep === 4 ? (
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
        </motion.div>
      </AnimatePresence>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10"
      >
        <p className="text-sm text-muted-foreground text-center">
          <span className="text-foreground font-medium">Tip:</span>{' '}
          {step.step === 'see' && 'Look around the room slowly. Notice colors, shapes, textures.'}
          {step.step === 'touch' && 'Feel the texture of your clothes, the chair, or desk.'}
          {step.step === 'hear' && 'Close your eyes. What sounds can you hear right now?'}
          {step.step === 'smell' && 'Breathe in slowly. What scents are in the air?'}
          {step.step === 'taste' && 'What taste is in your mouth? Take a sip of water if nearby.'}
        </p>
      </motion.div>
    </div>
  );
}

// Compact version for quick access
export function GroundingExerciseCompact({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = GROUNDING_STEPS[currentStep];
  const Icon = STEP_ICONS[step.step];
  const colors = STEP_COLORS[step.step];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
      <div className={cn('p-3 rounded-lg', colors.bg)}>
        <Icon className={cn('w-6 h-6', colors.text)} />
      </div>
      <div className="flex-1">
        <div className="font-medium">
          {step.count} things you {step.step}
        </div>
        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of 5
        </div>
      </div>
      <Button size="sm" onClick={handleNext}>
        {currentStep === 4 ? 'Done' : 'Next'}
      </Button>
    </div>
  );
}
