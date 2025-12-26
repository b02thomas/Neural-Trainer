'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ClipboardList, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { ChecklistView } from '@/components/reset/checklist';
import { useResetStore } from '@/stores/reset-store';

type Phase = 'intro' | 'checklist' | 'complete';

export default function PreTradeChecklistPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const { checklists, initializeDefaultChecklists } = useResetStore();
  const items = checklists.pre_trade;

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
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
                  <ClipboardList className="w-10 h-10 text-green-400" />
                </div>

                <h1 className="text-3xl font-bold mb-4">Pre-Trade Checklist</h1>

                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Verify every item before entering a trade. This helps prevent
                  impulsive entries and ensures you&apos;re following your plan.
                </p>

                <div className="glass-card p-6 mb-8 text-left">
                  <h3 className="font-medium mb-3">Why use a pre-trade checklist?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">-</span>
                      Prevents impulsive, emotional entries
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">-</span>
                      Ensures you&apos;ve done your analysis
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">-</span>
                      Confirms proper risk management
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">-</span>
                      Builds discipline over time
                    </li>
                  </ul>
                </div>

                <Button onClick={handleStart} className="glow-green min-w-[200px]">
                  Start Checklist
                </Button>

                <p className="text-xs text-muted-foreground mt-4">
                  {items.length} items to check
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
                  type="pre_trade"
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

                <h2 className="text-2xl font-bold mb-2">Ready to Trade</h2>
                <p className="text-muted-foreground mb-6">
                  You&apos;ve verified all items. Proceed with confidence and discipline.
                </p>

                <div className="glass-card p-6 mb-8">
                  <p className="text-lg font-medium text-green-400">
                    &ldquo;The best traders are systematic, not emotional.&rdquo;
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/reset">
                    <Button variant="outline" className="min-w-[180px]">
                      Back to Reset Hub
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setPhase('checklist')}
                    className="min-w-[180px]"
                  >
                    Run Again
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
