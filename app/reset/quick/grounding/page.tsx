'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { EmotionalScale } from '@/components/reset/assessment/emotional-scale';
import { TriggerSelector } from '@/components/reset/assessment/trigger-selector';
import { GroundingExercise } from '@/components/reset/quick/grounding-exercise';
import { SessionComplete } from '@/components/reset/shared/session-complete';
import { useResetStore } from '@/stores/reset-store';
import { TriggerType } from '@/types/reset';

type Phase = 'intro' | 'before' | 'trigger' | 'exercise' | 'after' | 'complete';

export default function GroundingPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [emotionalBefore, setEmotionalBefore] = useState<number | null>(null);
  const [emotionalAfter, setEmotionalAfter] = useState<number | null>(null);
  const [trigger, setTrigger] = useState<TriggerType | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const { startReset, setEmotionalState, completeReset } = useResetStore();

  const handleStart = () => {
    setPhase('before');
  };

  const handleBeforeComplete = () => {
    if (emotionalBefore !== null) {
      setEmotionalState(emotionalBefore, 'before');
      setPhase('trigger');
    }
  };

  const handleTriggerComplete = () => {
    startReset('grounding_sensory');
    setStartTime(Date.now());
    setPhase('exercise');
  };

  const handleExerciseComplete = () => {
    setPhase('after');
  };

  const handleAfterComplete = () => {
    if (emotionalAfter !== null) {
      setEmotionalState(emotionalAfter, 'after');
      setPhase('complete');
    }
  };

  const handleSessionComplete = () => {
    completeReset();
  };

  const getDuration = () => {
    if (!startTime) return 0;
    return Math.round((Date.now() - startTime) / 1000);
  };

  return (
    <div className="min-h-screen neural-bg grid-overlay">
      <MegaMenu />
      <MegaMenuSpacer />

      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <div className="mb-8">
            <Link href="/reset">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Reset Hub
              </Button>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {/* Intro */}
            {phase === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10 mb-6">
                  <Eye className="w-10 h-10 text-cyan-400" />
                </div>

                <h1 className="text-3xl font-bold mb-4">
                  5-4-3-2-1 Grounding
                </h1>

                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  A sensory grounding technique to bring you back to the present
                  moment and break emotional spirals.
                </p>

                <div className="glass-card p-6 mb-8 text-left">
                  <h3 className="font-medium mb-3">How it works:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">5</span>
                      things you can <strong className="text-foreground">see</strong>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">4</span>
                      things you can <strong className="text-foreground">touch</strong>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">3</span>
                      things you can <strong className="text-foreground">hear</strong>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">2</span>
                      things you can <strong className="text-foreground">smell</strong>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400 font-bold">1</span>
                      thing you can <strong className="text-foreground">taste</strong>
                    </li>
                  </ul>
                </div>

                <Button onClick={handleStart} className="glow-cyan min-w-[200px]">
                  Start Exercise
                </Button>

                <p className="text-xs text-muted-foreground mt-4">
                  Takes about 30-60 seconds
                </p>
              </motion.div>
            )}

            {/* Before emotional state */}
            {phase === 'before' && (
              <motion.div
                key="before"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Before we begin...</h2>
                  <p className="text-muted-foreground">
                    How are you feeling right now?
                  </p>
                </div>

                <EmotionalScale
                  value={emotionalBefore}
                  onChange={setEmotionalBefore}
                />

                <div className="flex justify-center">
                  <Button
                    onClick={handleBeforeComplete}
                    disabled={emotionalBefore === null}
                    className="min-w-[200px]"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Trigger selection */}
            {phase === 'trigger' && (
              <motion.div
                key="trigger"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <TriggerSelector value={trigger} onChange={setTrigger} />

                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={handleTriggerComplete}>
                    Skip
                  </Button>
                  <Button onClick={handleTriggerComplete} className="min-w-[150px]">
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Exercise */}
            {phase === 'exercise' && (
              <motion.div
                key="exercise"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GroundingExercise onComplete={handleExerciseComplete} />
              </motion.div>
            )}

            {/* After emotional state */}
            {phase === 'after' && (
              <motion.div
                key="after"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">✨</div>
                  <h2 className="text-2xl font-bold mb-2">Great work!</h2>
                  <p className="text-muted-foreground">
                    How are you feeling now?
                  </p>
                </div>

                <EmotionalScale
                  value={emotionalAfter}
                  onChange={setEmotionalAfter}
                />

                <div className="flex justify-center">
                  <Button
                    onClick={handleAfterComplete}
                    disabled={emotionalAfter === null}
                    className="min-w-[200px] glow-green"
                  >
                    See Results
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Complete */}
            {phase === 'complete' && emotionalBefore !== null && emotionalAfter !== null && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SessionComplete
                  resetType="grounding_sensory"
                  trigger={trigger || undefined}
                  emotionalStateBefore={emotionalBefore}
                  emotionalStateAfter={emotionalAfter}
                  durationSeconds={getDuration()}
                  onComplete={handleSessionComplete}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
