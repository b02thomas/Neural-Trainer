'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { PerspectiveShift } from '@/components/reset/quick/perspective-shift';
import { useResetStore } from '@/stores/reset-store';

type Phase = 'intro' | 'exercise' | 'complete';

export default function PerspectivePage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [startTime, setStartTime] = useState<number | null>(null);

  const { startReset, completeReset } = useResetStore();

  const handleStart = () => {
    startReset('perspective_shift');
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
                  <Clock className="w-10 h-10 text-amber-400" />
                </div>

                <h1 className="text-3xl font-bold mb-4">
                  Perspective Shift
                </h1>

                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Step back and see the bigger picture. This loss or setback
                  is just one moment in your trading journey.
                </p>

                <div className="glass-card p-6 mb-8 text-left">
                  <h3 className="font-medium mb-3">How it works:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">1.</span>
                      Read each perspective prompt carefully
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">2.</span>
                      Take a deep breath and let it sink in
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">3.</span>
                      Consider how this moment fits into your bigger picture
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 font-bold">4.</span>
                      Move on with renewed perspective
                    </li>
                  </ul>
                </div>

                <Button onClick={handleStart} className="glow-amber min-w-[200px]">
                  Start Exercise
                </Button>

                <p className="text-xs text-muted-foreground mt-4">
                  Takes about 30 seconds
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
                <PerspectiveShift onComplete={handleExerciseComplete} />
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

                <h2 className="text-2xl font-bold mb-2">Perspective Gained</h2>
                <p className="text-muted-foreground mb-6">
                  Remember: Every trade is just one of thousands in your career.
                </p>

                <div className="glass-card p-6 mb-8">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {getDuration()}s
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Time invested in your mental clarity
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
                  <Link href="/meditate/breathe" className="text-cyan-400 hover:underline">
                    breathing meditation
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
