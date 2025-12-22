'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Pause, Play, X, Activity, Timer, Bell, Waves } from 'lucide-react';
import Link from 'next/link';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { ChimeSelector, ThoughtCounter, MindfulnessDisplay } from '@/components/meditation/open-monitoring';
import { SessionSelector, MeditationCountdown, SessionComplete, BrainwaveSelector } from '@/components/meditation/shared';
import { useMeditationStore } from '@/stores/meditation-store';
import { useMeditationTimer } from '@/hooks/use-meditation-timer';
import { useMeditationAudio } from '@/hooks/use-meditation-audio';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export default function OpenMonitoringPage() {
  const {
    status,
    targetDuration,
    chimeInterval,
    thoughtTapCount,
    selectedBrainwave,
    sessions,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    resetSession,
    setTargetDuration,
    setChimeInterval,
    tapThought,
    setBrainwave,
  } = useMeditationStore();

  const audio = useMeditationAudio();

  // Chime callback
  const handleChime = useCallback(() => {
    audio.playChime();
  }, [audio]);

  const timer = useMeditationTimer({
    onChime: handleChime,
    onComplete: () => audio.playComplete(),
  });

  // Get the latest session for completion screen
  const latestSession = sessions[sessions.length - 1];

  const handleStart = () => {
    audio.warmUp();
    if (selectedBrainwave !== 'off') {
      audio.startBinauralBeat(selectedBrainwave);
    }
    startSession('open-monitoring', targetDuration);
  };

  const handleRestart = () => {
    resetSession();
  };

  const handleTapThought = () => {
    tapThought();
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
          // Space counts a thought during active session
          handleTapThought();
        } else if (status === 'paused') {
          resumeSession();
        } else if (status === 'idle') {
          handleStart();
        }
      } else if (e.code === 'Escape') {
        if (status === 'active' || status === 'paused') {
          stopSession();
        }
      } else if (e.code === 'KeyP' && status === 'active') {
        pauseSession();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, pauseSession, resumeSession, stopSession, startSession, targetDuration, tapThought]);

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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-4">
              <Activity className="w-4 h-4" />
              Open Monitoring
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-gradient-green">Offene</span>
              <span className="text-foreground ml-2">Achtsamkeit</span>
            </h1>
            <p className="text-muted-foreground">
              {status === 'idle' && 'Stille beobachten, Gedanken kommen und gehen lassen'}
              {status === 'countdown' && 'Finde deine Ruhe...'}
              {status === 'active' && 'Beobachte deinen Geist ohne zu urteilen'}
              {status === 'paused' && 'Session pausiert'}
              {status === 'completed' && 'Namaste'}
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
                {/* Info card */}
                <div className="glass-card p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Activity className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Über Open Monitoring</h3>
                      <p className="text-sm text-muted-foreground">
                        Achtsamkeitsmeditation ohne festen Fokus
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>Bei dieser Übung beobachtest du deinen Geist, ohne dich auf etwas Bestimmtes zu konzentrieren.</p>
                    <p>Wenn Gedanken auftauchen, nimm sie wahr und lass sie wieder ziehen wie Wolken am Himmel.</p>
                  </div>
                </div>

                {/* Duration selector */}
                <div className="glass-card p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Timer className="w-4 h-4" />
                    Session Dauer
                  </div>
                  <SessionSelector
                    selectedDuration={targetDuration}
                    onSelect={setTargetDuration}
                  />
                </div>

                {/* Chime selector */}
                <div className="glass-card p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Bell className="w-4 h-4" />
                    Glocken-Intervall
                  </div>
                  <ChimeSelector
                    selectedInterval={chimeInterval}
                    onSelect={setChimeInterval}
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Die Glocke hilft, die Aufmerksamkeit sanft zurückzubringen
                  </p>
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
                    className="px-12 py-6 text-lg glow-green"
                  >
                    <Activity className="w-5 h-5 mr-2" />
                    Session starten
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">
                    Drücke Leertaste zum Starten
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

            {/* Active/Paused state */}
            {(status === 'active' || status === 'paused') && (
              <motion.div
                key="active"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-8"
              >
                {/* Mindfulness display */}
                <MindfulnessDisplay
                  remainingMs={timer.remainingMs}
                  chimeInterval={chimeInterval}
                  elapsedMs={timer.elapsedMs}
                />

                {/* Thought counter */}
                <ThoughtCounter
                  count={thoughtTapCount}
                  onTap={handleTapThought}
                  disabled={status === 'paused'}
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
                      className="gap-2 glow-green"
                    >
                      <Play className="w-4 h-4" />
                      Fortsetzen
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Leertaste: Gedanke zählen • P: Pausieren • Escape: Beenden
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
