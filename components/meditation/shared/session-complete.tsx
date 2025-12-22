'use client';

import { motion } from 'motion/react';
import { CheckCircle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MeditationType, MeditationSession } from '@/types/meditation';
import { formatTime } from '@/hooks/use-meditation-timer';

interface SessionCompleteProps {
  session: MeditationSession | null;
  onRestart: () => void;
}

export function SessionComplete({ session, onRestart }: SessionCompleteProps) {
  if (!session) return null;

  const typeLabels: Record<MeditationType, string> = {
    'breathing': 'Breathing',
    'body-scan': 'Body Scan',
    'open-monitoring': 'Open Monitoring',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8"
    >
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="p-6 rounded-full bg-green-500/10 border border-green-500/20">
          <CheckCircle className="w-16 h-16 text-green-400" />
        </div>
      </motion.div>

      {/* Message */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gradient-purple-cyan">
          Session Complete
        </h2>
        <p className="text-muted-foreground">
          Well done! You completed a {session.duration} minute {typeLabels[session.type]} session.
        </p>
      </div>

      {/* Stats */}
      <div className="glass-card p-6 max-w-sm mx-auto">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-mono font-bold text-cyan-400">
              {formatTime(session.actualDurationMs)}
            </div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </div>

          {session.type === 'breathing' && session.cyclesCompleted !== undefined && (
            <div>
              <div className="text-2xl font-mono font-bold text-purple-400">
                {session.cyclesCompleted}
              </div>
              <div className="text-xs text-muted-foreground">Cycles</div>
            </div>
          )}

          {session.type === 'body-scan' && session.regionsCompleted !== undefined && (
            <div>
              <div className="text-2xl font-mono font-bold text-purple-400">
                {session.regionsCompleted}
              </div>
              <div className="text-xs text-muted-foreground">Regions</div>
            </div>
          )}

          {session.type === 'open-monitoring' && session.thoughtsNoticed !== undefined && (
            <div>
              <div className="text-2xl font-mono font-bold text-purple-400">
                {session.thoughtsNoticed}
              </div>
              <div className="text-xs text-muted-foreground">Thoughts</div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onRestart}
          className="glow-cyan"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Start Another Session
        </Button>

        <Link href="/meditate">
          <Button variant="outline" className="w-full sm:w-auto">
            <Home className="w-4 h-4 mr-2" />
            Back to Hub
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
