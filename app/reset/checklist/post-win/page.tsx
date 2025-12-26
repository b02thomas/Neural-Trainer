'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { ChecklistView } from '@/components/reset/checklist';
import { useResetStore } from '@/stores/reset-store';

type Phase = 'intro' | 'checklist' | 'complete';

export default function PostWinChecklistPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const { checklists, initializeDefaultChecklists } = useResetStore();
  const items = checklists.post_win;

  const handleStart = () => {
    if (items.length === 0) {
      initializeDefaultChecklists();
    }
    setPhase('checklist');
  };

  const handleComplete = () => {
    setPhase('complete');
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
                  <TrendingUp className="w-10 h-10 text-amber-400" />
                </div>

                <h1 className="text-3xl font-bold mb-4">Post-Win Review</h1>

                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Congratulations on your win! But stay humble - overconfidence after
                  wins is just as dangerous as revenge trading after losses.
                </p>

                <div className="glass-card p-6 mb-8 text-left">
                  <h3 className="font-medium mb-3">Why review wins?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">-</span>
                      Prevents overconfidence and reckless position sizing
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">-</span>
                      Helps distinguish skill from luck
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">-</span>
                      Reinforces following your trading plan
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">-</span>
                      Keeps you grounded for the next trade
                    </li>
                  </ul>
                </div>

                <Button onClick={handleStart} className="glow-amber min-w-[200px]">
                  Start Review
                </Button>

                <p className="text-xs text-muted-foreground mt-4">
                  Stay disciplined after wins
                </p>
              </motion.div>
            )}

            {/* Checklist */}
            {phase === 'checklist' && (
              <motion.div
                key="checklist"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ChecklistView
                  type="post_win"
                  items={items}
                  onComplete={handleComplete}
                />
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

                <h2 className="text-2xl font-bold mb-2">Stay Grounded</h2>
                <p className="text-muted-foreground mb-6">
                  Great job reviewing your win. Now proceed with the same discipline
                  that got you here.
                </p>

                <div className="glass-card p-6 mb-8">
                  <p className="text-lg font-medium text-amber-400">
                    &ldquo;One win doesn&apos;t make you a genius. One loss doesn&apos;t make you a failure.&rdquo;
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/reset">
                    <Button variant="outline" className="min-w-[180px]">
                      Back to Reset Hub
                    </Button>
                  </Link>
                  <Link href="/reset/checklist/pre-trade">
                    <Button className="min-w-[180px]">
                      Pre-Trade Checklist
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
