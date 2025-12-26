'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Dumbbell, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { PhysicalReset } from '@/components/reset/quick/physical-reset';
import { useResetStore } from '@/stores/reset-store';

type Phase = 'intro' | 'exercise' | 'complete';

export default function PhysicalResetPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [startTime, setStartTime] = useState<number | null>(null);

  const { startReset, completeReset } = useResetStore();

  const handleStart = () => {
    startReset('physical_reset');
    setStartTime(Date.now());
    setPhase('exercise');
  };

  const handleExerciseComplete = () => {
    setPhase('complete');
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
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 mb-6">
                  <Dumbbell className="w-10 h-10 text-amber-400" />
                </div>

                <h1 className="text-3xl font-bold mb-4">
                  Physical Reset
                </h1>

                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Quick physical movements to break the stress cycle and reset your
                  nervous system.
                </p>

                <div className="glass-card p-6 mb-8 text-left">
                  <h3 className="font-medium mb-3">Quick exercises include:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">Eye</span>
                      <span>- 20-20-20 rule for screen fatigue</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">Stretch</span>
                      <span>- Shoulder rolls and neck stretches</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">Hydrate</span>
                      <span>- Take a drink of water</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">Walk</span>
                      <span>- Get up and move around</span>
                    </li>
                  </ul>
                </div>

                <Button onClick={handleStart} className="glow-amber min-w-[200px]">
                  Start Exercises
                </Button>

                <p className="text-xs text-muted-foreground mt-4">
                  Takes 30-60 seconds
                </p>
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
                <PhysicalReset onComplete={handleExerciseComplete} />
              </motion.div>
            )}

            {/* Complete */}
            {phase === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 mb-6"
                >
                  <Sparkles className="w-12 h-12 text-green-400" />
                </motion.div>

                <h2 className="text-2xl font-bold mb-2">Body Reset Complete</h2>
                <p className="text-muted-foreground mb-6">
                  Your body and mind are connected. Moving one resets the other.
                </p>

                <div className="glass-card p-6 mb-8">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {getDuration()}s
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active reset time
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/reset">
                    <Button
                      variant="outline"
                      onClick={handleSessionComplete}
                      className="min-w-[180px]"
                    >
                      Back to Reset Hub
                    </Button>
                  </Link>
                  <Link href="/reset/quick/grounding">
                    <Button className="min-w-[180px]">
                      Try Grounding
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-muted-foreground mt-6">
                  Need a deeper reset? Try the{' '}
                  <Link href="/meditate/body-scan" className="text-cyan-400 hover:underline">
                    body scan meditation
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
