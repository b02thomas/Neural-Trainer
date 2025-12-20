import { AlertTriangle, X, Zap } from 'lucide-react';
import { AnswerOutcome } from '@/types/game';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface FeedbackOverlayProps {
  outcome: AnswerOutcome | null;
  show: boolean;
  className?: string;
}

export function FeedbackOverlay({ outcome, show, className }: FeedbackOverlayProps) {
  const feedbackConfig = {
    success: {
      icon: Zap,
      color: 'text-cyan-400',
      glow: 'rgba(6, 182, 212, 0.5)',
      border: 'border-cyan-500/50',
      message: 'CORRECT',
      description: 'Neural pathway activated',
    },
    impulse_error: {
      icon: AlertTriangle,
      color: 'text-orange-400',
      glow: 'rgba(251, 146, 60, 0.5)',
      border: 'border-orange-500/50',
      message: 'IMPULSE ERROR',
      description: 'Automatic response triggered',
    },
    wrong_choice: {
      icon: X,
      color: 'text-red-400',
      glow: 'rgba(239, 68, 68, 0.5)',
      border: 'border-red-500/50',
      message: 'INCORRECT',
      description: 'Recalibrating...',
    },
  };

  if (!outcome) {
    return null;
  }

  const config = feedbackConfig[outcome];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "fixed inset-0 flex items-center justify-center z-50",
            "bg-black/70 backdrop-blur-sm",
            className
          )}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              "glass-card rounded-2xl border-2 p-8 max-w-sm mx-4 text-center",
              config.border
            )}
            style={{
              boxShadow: `0 0 60px ${config.glow}, inset 0 0 30px ${config.glow}20`,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.05 }}
              className="mb-4"
            >
              <Icon
                className={cn("w-16 h-16 mx-auto", config.color)}
                strokeWidth={2}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3
                className={cn("text-2xl font-bold tracking-wider mb-2", config.color)}
              >
                {config.message}
              </h3>
              <p className="text-white/50 text-sm">
                {config.description}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
