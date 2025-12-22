'use client';

import { useCallback } from 'react';
import { useGameStore } from '@/stores/game-store';
import { useTrainingSync } from '@/hooks/use-training-sync';
import { StatsDashboard } from '@/components/stats/stats-dashboard';
import { Button } from '@/components/ui/button';
import { Play, Brain, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { motion } from 'motion/react';
import type { RoundResult } from '@/types/game';

export default function StatsPage() {
  const rounds = useGameStore((state) => state.rounds);
  const loadHistoricalData = useGameStore((state) => state.loadHistoricalData);

  // Load data from Supabase when authenticated
  const onStroopDataLoaded = useCallback((loadedRounds: RoundResult[], bestStreak: number) => {
    loadHistoricalData(loadedRounds, bestStreak);
  }, [loadHistoricalData]);

  const { isLoading, isAuthenticated } = useTrainingSync({
    onStroopDataLoaded,
  });

  return (
    <div className="min-h-screen neural-bg grid-overlay">
      <MegaMenu />
      <MegaMenuSpacer />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient-purple-cyan">Neural</span> Statistics
            </h1>
            <p className="text-muted-foreground">
              Track your cognitive performance and improvement over time
            </p>
          </motion.div>

          {isLoading ? (
            <motion.div
              className="bento-card text-center py-16 space-y-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading your statistics...</p>
            </motion.div>
          ) : rounds.length > 0 ? (
            <StatsDashboard rounds={rounds} />
          ) : (
            <motion.div
              className="bento-card text-center py-16 space-y-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="p-4 rounded-2xl bg-purple-500/10 inline-flex">
                <Brain className="w-12 h-12 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                No Data Available
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {isAuthenticated
                  ? 'Complete a few training sessions to see your performance statistics and track your improvement.'
                  : 'Sign in to track your progress across sessions, or play a game to see stats for this session.'}
              </p>
              <div className="pt-4">
                <Link href="/play">
                  <Button size="lg" className="gap-2 glow-purple">
                    <Play className="w-5 h-5" />
                    Start Training
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
