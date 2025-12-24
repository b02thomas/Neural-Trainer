'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Pause, Play, X, Heart, Timer, Waves } from 'lucide-react';
import Link from 'next/link';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { BodySilhouette, RegionInfo, ScanProgress } from '@/components/meditation/body-scan';
import { SessionSelector, MeditationCountdown, SessionComplete, BrainwaveSelector } from '@/components/meditation/shared';
import { useMeditationStore } from '@/stores/meditation-store';
import { useMeditationTimer, formatTime } from '@/hooks/use-meditation-timer';
import { useMeditationAudio } from '@/hooks/use-meditation-audio';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export default function BodyScanPage() {
  const {
    status,
    targetDuration,
    selectedBrainwave,
    sessions,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    resetSession,
    setTargetDuration,
    setBrainwave,
  } = useMeditationStore();

  const audio = useMeditationAudio();

  // Region change callback for subtle audio feedback
  const handleRegionChange = useCallback(() => {
    audio.playTransition();
  }, [audio]);

  const timer = useMeditationTimer({
    onRegionChange: handleRegionChange,
    onComplete: () => audio.playComplete(),
  });

  // Get the latest session for completion screen
  const latestSession = sessions[sessions.length - 1];

  const handleStart = () => {
    audio.warmUp();
    if (selectedBrainwave !== 'off') {
      audio.startBinauralBeat(selectedBrainwave);
    }
    startSession('body-scan', targetDuration);
  };

  const handleRestart = () => {
    resetSession();
  };

  // Handle binaural beats based on session status
  useEffect(() => {
    if (status === 'idle' || status === 'completed') {
      audio.stopBinauralBeat();
    } else if (status === 'paused') {
      audio.muteBinauralBeat();
    } else if (status === 'active') {
      audio.unmuteBinauralBeat();
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
              <Heart className="w-4 h-4" />
              Body Scan
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-gradient-purple-cyan">Body</span>
              <span className="text-foreground ml-2">Scan</span>
            </h1>
            <p className="text-muted-foreground">
              {status === 'idle' && 'Wähle die Dauer und beginne die Reise durch deinen Körper'}
              {status === 'countdown' && 'Mach es dir bequem...'}
              {status === 'active' && 'Spüre in die markierte Region hinein'}
              {status === 'paused' && 'Session pausiert'}
              {status === 'completed' && 'Wunderbar!'}
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
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Heart className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Über Body Scan</h3>
                      <p className="text-sm text-muted-foreground">
                        Eine Achtsamkeitsübung zur Körperwahrnehmung
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>Der Body Scan führt dich systematisch durch 15 Körperregionen - von den Füßen bis zum Kopf.</p>
                    <p>Bei jeder Region wirst du eingeladen, die Empfindungen dort bewusst wahrzunehmen.</p>
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
                  <p className="text-xs text-muted-foreground text-center">
                    {Math.round((targetDuration * 60) / 15)} Sekunden pro Region
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
                    className="px-12 py-6 text-lg glow-purple"
                  >
                    <Heart className="w-5 h-5 mr-2" />
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

            {/* Active/Paused state - Body Scan */}
            {(status === 'active' || status === 'paused') && (
              <motion.div
                key="active"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                {/* Progress bar at top */}
                <ScanProgress
                  currentRegionIndex={timer.currentRegionIndex}
                  regionProgress={timer.regionProgress}
                />

                {/* Timer display */}
                <div className="text-center">
                  <div className="font-mono text-3xl font-bold text-foreground">
                    {formatTime(timer.remainingMs)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    verbleibend
                  </div>
                </div>

                {/* Main content: Silhouette + Region Info */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                  {/* Body Silhouette */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <BodySilhouette
                      activeRegion={timer.currentRegion}
                      completedRegions={timer.currentRegionIndex}
                      size={280}
                    />
                  </motion.div>

                  {/* Region Info */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex-1 max-w-sm"
                  >
                    <RegionInfo
                      currentRegion={timer.currentRegion}
                      regionProgress={timer.regionProgress}
                      completedRegions={timer.currentRegionIndex}
                    />
                  </motion.div>
                </div>

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
                      className="gap-2 glow-purple"
                    >
                      <Play className="w-4 h-4" />
                      Fortsetzen
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Leertaste: {status === 'active' ? 'Pausieren' : 'Fortsetzen'} • Escape: Beenden
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
