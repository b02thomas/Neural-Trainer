'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DurationSelector, CooldownTimer, CooldownActivities } from '@/components/reset/cooldown';
import { useResetStore } from '@/stores/reset-store';
import { CooldownDuration } from '@/types/reset';

type Phase = 'setup' | 'active' | 'complete' | 'cancelled';

export default function CooldownPage() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [duration, setDuration] = useState<CooldownDuration>(15);
  const [reason, setReason] = useState('');

  const { startCooldown, completeCooldown, cancelCooldown } = useResetStore();

  const handleStart = () => {
    startCooldown(duration, reason || undefined);
    setPhase('active');
  };

  const handleComplete = () => {
    completeCooldown();
    setPhase('complete');
  };

  const handleCancel = () => {
    cancelCooldown();
    setPhase('cancelled');
  };

  const handleReset = () => {
    setPhase('setup');
    setReason('');
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
            {/* Setup */}
            {phase === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 mb-6">
                    <Clock className="w-10 h-10 text-amber-400" />
                  </div>

                  <h1 className="text-3xl font-bold mb-4">Cooldown Timer</h1>

                  <p className="text-muted-foreground max-w-md mx-auto">
                    Force yourself to take a break before your next trade. This prevents
                    overtrading and revenge trading.
                  </p>
                </div>

                <div className="glass-card p-6 space-y-6">
                  <DurationSelector value={duration} onChange={setDuration} />

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Reason for cooldown (optional)
                    </label>
                    <Input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g., Taking a loss, feeling FOMO..."
                      className="bg-white/5"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <Button onClick={handleStart} className="glow-amber min-w-[200px]">
                    Start {duration} Minute Cooldown
                  </Button>
                </div>

                <div className="glass-card p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    <span className="text-foreground font-medium">Tip:</span>{' '}
                    Even a 5-minute break can prevent impulsive decisions.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Active */}
            {phase === 'active' && (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <CooldownTimer
                  duration={duration}
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                />

                <CooldownActivities />

                <div className="glass-card p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    <span className="text-foreground font-medium">Remember:</span>{' '}
                    The market will be here when you get back. Your capital might not
                    be if you don&apos;t take this break.
                  </p>
                </div>
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

                <h2 className="text-2xl font-bold mb-2">Cooldown Complete</h2>
                <p className="text-muted-foreground mb-6">
                  You took the time you needed. Now trade with a clear head.
                </p>

                <div className="glass-card p-6 mb-8">
                  <p className="text-lg font-medium text-green-400">
                    &ldquo;Patience is a competitive advantage in trading.&rdquo;
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/reset/checklist/pre-trade">
                    <Button variant="outline" className="min-w-[180px]">
                      Pre-Trade Checklist
                    </Button>
                  </Link>
                  <Link href="/reset">
                    <Button className="min-w-[180px]">
                      Back to Reset Hub
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Cancelled */}
            {phase === 'cancelled' && (
              <motion.div
                key="cancelled"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-500/10 mb-6"
                >
                  <AlertTriangle className="w-12 h-12 text-amber-400" />
                </motion.div>

                <h2 className="text-2xl font-bold mb-2">Cooldown Cancelled</h2>
                <p className="text-muted-foreground mb-6">
                  Are you sure you&apos;re ready to trade? Consider restarting the cooldown.
                </p>

                <div className="glass-card p-6 mb-8">
                  <p className="text-lg font-medium text-amber-400">
                    &ldquo;Cutting your cooldown short is a sign you might not be ready.&rdquo;
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="min-w-[180px]"
                  >
                    Restart Cooldown
                  </Button>
                  <Link href="/reset">
                    <Button className="min-w-[180px]">
                      Back to Reset Hub
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
