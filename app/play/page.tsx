'use client';

import { useState, useEffect, useRef } from 'react';
import { useStroopGame } from '@/hooks/use-stroop-game';
import { AnswerOutcome } from '@/types/game';
import { StroopDisplay } from '@/components/game/stroop-display';
import { ColorButtons } from '@/components/game/color-buttons';
import { TimerDisplay } from '@/components/game/timer-display';
import { FeedbackOverlay } from '@/components/game/feedback-overlay';
import { GameControls, Countdown } from '@/components/game/game-controls';
import { SpeedBadge } from '@/components/game/speed-badge';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Activity } from 'lucide-react';
import Link from 'next/link';
import { getColor } from '@/lib/colors';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useNeuralToast } from '@/components/ui/neural-toast';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';

const FEEDBACK_DURATION = 800;

export default function PlayPage() {
  const game = useStroopGame();
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastOutcome, setLastOutcome] = useState<AnswerOutcome | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);
  const toast = useNeuralToast();

  const nextRoundRef = useRef(game.nextRound);
  useEffect(() => {
    nextRoundRef.current = game.nextRound;
  });

  // Toast on game start
  const prevStatusRef = useRef(game.status);
  useEffect(() => {
    if (game.status === 'playing' && prevStatusRef.current === 'countdown') {
      toast.show('Neural Link Established', 'link');
    }
    prevStatusRef.current = game.status;
  }, [game.status, toast]);

  // Toast on streak milestones
  const prevStreakRef = useRef(game.currentStreak);
  useEffect(() => {
    const milestones = [5, 10, 15, 20];
    if (milestones.includes(game.currentStreak) && game.currentStreak > prevStreakRef.current) {
      toast.show(`${game.currentStreak} Streak! Neural pathway strengthened`, 'success');
    }
    prevStreakRef.current = game.currentStreak;
  }, [game.currentStreak, toast]);

  const prevRoundsLengthRef = useRef(game.rounds.length);

  useEffect(() => {
    if (game.status === 'countdown') {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCountdown(0);
    }
  }, [game.status]);

  useEffect(() => {
    const hasNewAnswer = game.rounds.length > prevRoundsLengthRef.current;
    if (game.status === 'paused' && hasNewAnswer) {
      const lastRound = game.rounds[game.rounds.length - 1];
      setLastOutcome(lastRound.outcome);
      setShowFeedback(true);
      // Glitch effect on round transition
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 300);
      const timer = setTimeout(() => {
        setShowFeedback(false);
        setTimeout(() => {
          nextRoundRef.current();
        }, 100);
      }, FEEDBACK_DURATION);
      prevRoundsLengthRef.current = game.rounds.length;
      return () => clearTimeout(timer);
    }
    prevRoundsLengthRef.current = game.rounds.length;
  }, [game.status, game.rounds.length]);

  const accuracy = game.rounds.length > 0
    ? Math.round((game.rounds.filter((r) => r.outcome === 'success').length / game.rounds.length) * 100)
    : 0;

  const avgReactionTime = game.rounds.length > 0
    ? Math.round(game.rounds.reduce((sum, r) => sum + r.reactionTimeMs, 0) / game.rounds.length)
    : 0;

  return (
    <div className="min-h-screen neural-bg grid-overlay">
      <MegaMenu />
      <MegaMenuSpacer />

      {/* Main Content */}
      <main className="pb-8 px-4 min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex-1 container mx-auto max-w-6xl flex flex-col">

          {/* Status Bar - Bento Grid */}
          <AnimatePresence>
            {game.status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
              >
                {/* Round */}
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                    <Activity className="w-3 h-3" />
                    ROUND
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {game.currentRoundNumber}<span className="text-white/30">/{game.totalRounds}</span>
                  </div>
                </div>

                {/* Streak + Speed */}
                <div className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-white/50 text-xs">
                      <Zap className="w-3 h-3 text-purple-500" />
                      STREAK
                    </div>
                    <SpeedBadge speedLevel={game.speedLevel} />
                  </div>
                  <div className={cn(
                    "text-2xl font-bold font-mono",
                    game.currentStreak >= 3 ? "text-purple-400" : "text-white"
                  )}>
                    {game.currentStreak}
                  </div>
                </div>

                {/* Accuracy */}
                <div className="glass-card rounded-xl p-4">
                  <div className="text-white/50 text-xs mb-1">ACCURACY</div>
                  <div className="text-2xl font-bold font-mono text-cyan-400">
                    {accuracy}<span className="text-sm">%</span>
                  </div>
                </div>

                {/* Reaction */}
                <div className="glass-card rounded-xl p-4">
                  <div className="text-white/50 text-xs mb-1">AVG REACTION</div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {avgReactionTime}<span className="text-sm text-white/50">ms</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Focus Chamber */}
          <div className="flex-1 flex items-center justify-center py-8">
            <div className="w-full max-w-3xl">

              {/* Idle State - Welcome */}
              <AnimatePresence mode="wait">
                {game.status === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card glow-border rounded-2xl p-8 md:p-12 text-center"
                  >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center neural-pulse">
                      <Brain className="w-8 h-8 text-purple-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      Cognitive Training
                    </h2>
                    <p className="text-white/60 text-lg mb-2">
                      Identify the <span className="text-cyan-400 font-semibold">INK COLOR</span>, not the word.
                    </p>
                    <p className="text-white/40 text-sm mb-8">
                      Train your neural pathways to override automatic responses.
                    </p>
                    <Button
                      onClick={() => game.startGame(30)}
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-500 text-white px-12 py-6 text-lg glow-purple"
                    >
                      Initialize Training
                    </Button>
                  </motion.div>
                )}

                {/* Finished State */}
                {game.status === 'finished' && (
                  <motion.div
                    key="finished"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card glow-border rounded-2xl p-8 md:p-12 text-center"
                  >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gradient-purple-cyan mb-8">
                      Training Complete
                    </h2>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="glass-card rounded-xl p-4">
                        <div className="text-3xl font-bold text-cyan-400 font-mono">{accuracy}%</div>
                        <div className="text-xs text-white/50 mt-1">ACCURACY</div>
                      </div>
                      <div className="glass-card rounded-xl p-4">
                        <div className="text-3xl font-bold text-purple-400 font-mono">{game.bestStreak}</div>
                        <div className="text-xs text-white/50 mt-1">BEST STREAK</div>
                      </div>
                      <div className="glass-card rounded-xl p-4">
                        <div className="text-3xl font-bold text-white font-mono">{avgReactionTime}<span className="text-sm">ms</span></div>
                        <div className="text-xs text-white/50 mt-1">AVG TIME</div>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={() => game.startGame(30)}
                        size="lg"
                        className="bg-purple-600 hover:bg-purple-500 text-white px-8"
                      >
                        Train Again
                      </Button>
                      <Link href="/stats">
                        <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/5">
                          View Stats
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                )}

                {/* Playing / Paused State - Focus Chamber */}
                {(game.status === 'playing' || game.status === 'paused' || game.status === 'countdown') && (
                  <motion.div
                    key="playing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn("focus-chamber rounded-2xl p-8 md:p-12", showGlitch && "glitch")}
                  >
                    {/* Stroop Display */}
                    <StroopDisplay
                      challenge={showFeedback || game.status === 'countdown' ? null : game.currentChallenge}
                    />

                    {/* Paused - Show Answer */}
                    {game.status === 'paused' && !showFeedback && game.currentChallenge && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mt-6 space-y-4"
                      >
                        <p className="text-white/50 text-sm uppercase tracking-wider">Correct Answer</p>
                        <p className={cn("text-3xl font-bold", getColor(game.currentChallenge.inkColor).tailwindClass)}>
                          {getColor(game.currentChallenge.inkColor).displayName}
                        </p>
                        <Button
                          onClick={game.resumeGame}
                          className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 mt-4"
                        >
                          Continue
                        </Button>
                      </motion.div>
                    )}

                    {/* Timer - Countdown Mode */}
                    {game.status === 'playing' && (
                      <div className="mt-6 flex justify-center">
                        <TimerDisplay
                          elapsedTime={game.elapsedTime}
                          isRunning={game.isTimerRunning}
                          timeoutMs={game.timeoutMs}
                          timeRemaining={game.timeRemaining}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Control HUD */}
          <div className="space-y-4">
            {/* Color Buttons */}
            <ColorButtons
              onColorSelect={game.handleAnswerSelection}
              buttonOrder={game.buttonOrder}
              disabled={game.status !== 'playing'}
            />

            {/* Game Controls */}
            <GameControls
              status={game.status}
              onStart={() => game.startGame(30)}
              onPause={game.pauseGame}
              onReset={game.resetGame}
            />
          </div>
        </div>
      </main>

      {/* Overlays */}
      <Countdown count={countdown} />
      <FeedbackOverlay outcome={lastOutcome} show={showFeedback} />
    </div>
  );
}
