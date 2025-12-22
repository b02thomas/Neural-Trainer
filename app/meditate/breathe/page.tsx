'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Pause, Play, X, Wind, Timer, Activity, Waves } from 'lucide-react';
import Link from 'next/link';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { BreathingCircle, PhaseIndicator, PatternSelector } from '@/components/meditation/breathing';
import { SessionSelector, MeditationCountdown, SessionComplete, BrainwaveSelector } from '@/components/meditation/shared';
import { useMeditationStore } from '@/stores/meditation-store';
import { useMeditationTimer, formatTime } from '@/hooks/use-meditation-timer';
import { useMeditationAudio } from '@/hooks/use-meditation-audio';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export default function BreathePage() {
  const {
    status,
    targetDuration,
    breathingPattern,
    selectedBrainwave,
    sessions,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    resetSession,
    setBreathingPattern,
    setTargetDuration,
    setBrainwave,
  } = useMeditationStore();

  const audio = useMeditationAudio();
  const timer = useMeditationTimer({
    onComplete: () => audio.playComplete(),
  });

  // Get the latest session for completion screen
  const latestSession = sessions[sessions.length - 1];

  const handleStart = () => {
    audio.warmUp();
    if (selectedBrainwave !== 'off') {
      audio.startBinauralBeat(selectedBrainwave);
    }
    startSession('breathing', targetDuration);
  };

  const handleRestart = () => {
    resetSession();
  };

  // Stop binaural when session ends
  useEffect(() => {
    if (status === 'idle' || status === 'completed') {
      audio.stopBinauralBeat();
    }
  }, [status, audio]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (status === 'active') {
          pauseSession();
        } else if (status === 'paused') {
          resumeSession();
        } else if (status === 'idle') {
          handleStart();
        }
      } else if (e.code === 'Escape') {
        if (status === 'active' || status === 'paused') {
          stopSession();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, pauseSession, resumeSession, stopSession, startSession, targetDuration]);

  return (
    <div className="min-h-screen neural-bg grid-overlay">
      <MegaMenu />
      <MegaMenuSpacer />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header with back button */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-between"
          >
            <Link href="/meditate">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>

            {(status === 'active' || status === 'paused') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={stopSession}
                className="gap-2 text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
                End Session
              </Button>
            )}
          </motion.div>

          {/* Title */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
              <Wind className="w-4 h-4" />
              Box Breathing
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-gradient-purple-cyan">Breathing</span>
              <span className="text-foreground ml-2">Exercise</span>
            </h1>
            <p className="text-muted-foreground">
              {status === 'idle' && 'Select your pattern and duration to begin'}
              {status === 'countdown' && 'Get ready...'}
              {status === 'active' && 'Follow the circle with your breath'}
              {status === 'paused' && 'Session paused'}
              {status === 'completed' && 'Great work!'}
            </p>
          </motion.div>

          {/* Main content area */}
          <AnimatePresence mode="wait">
            {/* Idle state - Settings */}
            {status === 'idle' && (
              <motion.div
                key="idle"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-8"
              >
                {/* Pattern selector */}
                <div className="glass-card p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Activity className="w-4 h-4" />
                    Breathing Pattern
                  </div>
                  <PatternSelector
                    selectedPattern={breathingPattern}
                    onSelect={setBreathingPattern}
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    {breathingPattern === '4-4-4-4'
                      ? 'Equal 4-second phases for balance and focus'
                      : 'Extended exhale for deep relaxation'}
                  </p>
                </div>

                {/* Duration selector */}
                <div className="glass-card p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Timer className="w-4 h-4" />
                    Session Duration
                  </div>
                  <SessionSelector
                    selectedDuration={targetDuration}
                    onSelect={setTargetDuration}
                  />
                </div>

                {/* Brainwave selector */}
                <div className="glass-card p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Waves className="w-4 h-4" />
                    Binaural Beats
                  </div>
                  <BrainwaveSelector
                    selectedBrainwave={selectedBrainwave}
                    onSelect={setBrainwave}
                  />
                </div>

                {/* Start button */}
                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={handleStart}
                    className="px-12 py-6 text-lg glow-cyan"
                  >
                    <Wind className="w-5 h-5 mr-2" />
                    Start Session
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    Press Space to start
                  </p>
                </div>
              </motion.div>
            )}

            {/* Countdown state */}
            {status === 'countdown' && (
              <motion.div
                key="countdown"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MeditationCountdown />
              </motion.div>
            )}

            {/* Active/Paused state - Breathing circle */}
            {(status === 'active' || status === 'paused') && (
              <motion.div
                key="active"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-8"
              >
                {/* Timer display */}
                <div className="text-center">
                  <div className="font-mono text-4xl font-bold text-foreground">
                    {formatTime(timer.remainingMs)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    remaining
                  </div>
                </div>

                {/* Breathing circle */}
                <div className="flex justify-center">
                  <BreathingCircle
                    phase={timer.currentPhase}
                    progress={timer.phaseProgress}
                  />
                </div>

                {/* Phase indicator */}
                <PhaseIndicator
                  phase={timer.currentPhase}
                  cycleCount={timer.cycleCount}
                />

                {/* Pause/Resume button */}
                <div className="flex justify-center gap-4">
                  {status === 'active' ? (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={pauseSession}
                      className="gap-2"
                    >
                      <Pause className="w-4 h-4" />
                      Pause
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={resumeSession}
                      className="gap-2 glow-cyan"
                    >
                      <Play className="w-4 h-4" />
                      Resume
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Press Space to {status === 'active' ? 'pause' : 'resume'} • Escape to end
                </p>
              </motion.div>
            )}

            {/* Completed state */}
            {status === 'completed' && (
              <motion.div
                key="completed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SessionComplete
                  session={latestSession}
                  onRestart={handleRestart}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
