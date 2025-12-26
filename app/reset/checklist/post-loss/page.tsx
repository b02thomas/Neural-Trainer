'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, AlertTriangle, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { ChecklistView } from '@/components/reset/checklist';
import { useResetStore } from '@/stores/reset-store';

type Phase = 'intro' | 'checklist' | 'complete';

export default function PostLossChecklistPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const { checklists, initializeDefaultChecklists } = useResetStore();
  const items = checklists.post_loss;

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
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                </div>

                <h1 className="text-3xl font-bold mb-4">Post-Loss Protocol</h1>

                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Taking a loss is hard. This protocol helps you process it properly
                  and prevents revenge trading.
                </p>

                <div className="glass-card p-6 mb-8 text-left">
                  <h3 className="font-medium mb-3">Remember:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">-</span>
                      Losses are part of trading - even the best traders lose
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">-</span>
                      The goal is not to avoid losses, but to manage them
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">-</span>
                      Revenge trading turns small losses into big ones
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">-</span>
                      Your next quality setup will come
                    </li>
                  </ul>
                </div>

                <Button onClick={handleStart} className="min-w-[200px]">
                  Start Protocol
                </Button>

                <p className="text-xs text-muted-foreground mt-4">
                  Take your time with each item
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
                  type="post_loss"
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
                  <Heart className="w-12 h-12 text-green-400" />
                </motion.div>

                <h2 className="text-2xl font-bold mb-2">Loss Processed</h2>
                <p className="text-muted-foreground mb-6">
                  You&apos;ve handled this loss properly. Take a break before your next trade.
                </p>

                <div className="glass-card p-6 mb-8">
                  <p className="text-lg font-medium text-purple-400">
                    &ldquo;The market will be here tomorrow. Your capital won&apos;t be if you revenge trade.&rdquo;
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/reset/cooldown">
                    <Button variant="outline" className="min-w-[180px]">
                      Start Cooldown Timer
                    </Button>
                  </Link>
                  <Link href="/reset">
                    <Button className="min-w-[180px]">
                      Back to Reset Hub
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-muted-foreground mt-6">
                  Consider taking a{' '}
                  <Link href="/meditate/breathe" className="text-cyan-400 hover:underline">
                    breathing meditation
                  </Link>{' '}
                  before your next trade.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
