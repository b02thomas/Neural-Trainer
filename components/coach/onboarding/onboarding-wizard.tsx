'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Check, Zap, MessageSquare, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCoachStore } from '@/stores/coach-store';
import {
  FocusArea,
  CoachingStyle,
  COACHING_STYLE_CONFIGS,
} from '@/types/coach';
import { FocusAreaSelector } from './focus-area-selector';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Step = 'welcome' | 'focus' | 'style' | 'complete';

const STEPS: Step[] = ['welcome', 'focus', 'style', 'complete'];

const STYLE_ICONS: Record<CoachingStyle, React.ElementType> = {
  direct: Zap,
  supportive: MessageSquare,
  socratic: Target,
};

interface OnboardingWizardProps {
  onComplete?: () => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const router = useRouter();
  const { preferences, updatePreferences, completeOnboarding } = useCoachStore();

  const [step, setStep] = useState<Step>('welcome');
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>(
    preferences.focusAreas.length > 0 ? preferences.focusAreas : ['trading']
  );
  const [style, setStyle] = useState<CoachingStyle>(preferences.coachingStyle);

  const currentIndex = STEPS.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < STEPS.length) {
      setStep(STEPS[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setStep(STEPS[prevIndex]);
    }
  };

  const handleComplete = () => {
    updatePreferences({
      focusAreas,
      coachingStyle: style,
    });
    completeOnboarding();
    onComplete?.();
    router.push('/coach/chat');
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              i <= currentIndex ? 'bg-cyan-400' : 'bg-white/20'
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Welcome Step */}
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10 mb-6">
              <MessageSquare className="w-10 h-10 text-cyan-400" />
            </div>

            <h2 className="text-2xl font-bold mb-4">
              Welcome to Your AI Coach
            </h2>

            <p className="text-muted-foreground mb-8">
              I&apos;m here to help you develop mental resilience, work through
              challenges, and build better habits. Let&apos;s customize your
              experience.
            </p>

            <Button onClick={handleNext} className="glow-cyan">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* Focus Areas Step */}
        {step === 'focus' && (
          <motion.div
            key="focus"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-2 text-center">
              What would you like to work on?
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Select one or more focus areas. You can change this anytime.
            </p>

            <FocusAreaSelector
              selected={focusAreas}
              onChange={setFocusAreas}
              className="mb-8"
            />

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1 glow-cyan">
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Coaching Style Step */}
        {step === 'style' && (
          <motion.div
            key="style"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold mb-2 text-center">
              How should I communicate with you?
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Choose your preferred coaching style.
            </p>

            <div className="space-y-3 mb-8">
              {Object.values(COACHING_STYLE_CONFIGS).map((styleConfig, index) => {
                const Icon = STYLE_ICONS[styleConfig.id];
                const isSelected = style === styleConfig.id;

                return (
                  <motion.button
                    key={styleConfig.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setStyle(styleConfig.id)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-xl transition-all',
                      'border',
                      isSelected
                        ? 'bg-purple-500/10 border-purple-500/40'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        isSelected ? 'bg-purple-500/20' : 'bg-white/10'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-5 h-5',
                          isSelected ? 'text-purple-400' : 'text-muted-foreground'
                        )}
                      />
                    </div>

                    <div className="flex-1 text-left">
                      <div className="font-medium">{styleConfig.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {styleConfig.description}
                      </div>
                    </div>

                    <div
                      className={cn(
                        'w-6 h-6 rounded-full border flex items-center justify-center transition-colors',
                        isSelected
                          ? 'bg-purple-500/20 border-purple-500/40'
                          : 'border-white/20'
                      )}
                    >
                      {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1 glow-cyan">
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6"
            >
              <Check className="w-10 h-10 text-green-400" />
            </motion.div>

            <h2 className="text-2xl font-bold mb-4">You&apos;re All Set!</h2>

            <p className="text-muted-foreground mb-8">
              Your AI coach is ready to help you with{' '}
              <span className="text-foreground">
                {focusAreas
                  .map(
                    (a) =>
                      a.charAt(0).toUpperCase() + a.slice(1).replace('_', ' ')
                  )
                  .join(', ')}
              </span>{' '}
              using a{' '}
              <span className="text-foreground">{style}</span> approach.
            </p>

            <div className="glass-card p-4 mb-8 text-left">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">Tip:</span> The more
                context you share about your situation, the better I can help.
                Don&apos;t hold back!
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleComplete} className="flex-1 glow-cyan">
                Start Chatting
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
