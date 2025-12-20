import { Flame, Trophy, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ScorePanelProps {
  currentStreak: number;
  bestStreak: number;
  currentRound: number;
  totalRounds: number;
  className?: string;
}

export function ScorePanel({
  currentStreak,
  bestStreak,
  currentRound,
  totalRounds,
  className,
}: ScorePanelProps) {
  const hasGoodStreak = currentStreak >= 3;
  const isMilestone = currentStreak > 0 && currentStreak % 5 === 0;

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Current Round */}
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Round</span>
            <span className="text-lg font-bold">
              {currentRound}/{totalRounds}
            </span>
          </div>
        </div>

        {/* Current Streak */}
        <div className="flex items-center gap-2">
          <motion.div
            animate={hasGoodStreak ? {
              scale: [1, 1.2, 1],
              rotate: [0, -10, 10, -10, 0]
            } : {}}
            transition={{
              duration: 0.5,
              repeat: hasGoodStreak ? Infinity : 0,
              repeatDelay: 2
            }}
          >
            <Flame
              className={cn(
                "w-5 h-5",
                hasGoodStreak ? "text-orange-500" : "text-muted-foreground"
              )}
            />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Streak</span>
            <div className="flex items-center gap-2">
              <motion.span
                key={currentStreak}
                initial={{ scale: 1 }}
                animate={isMilestone ? {
                  scale: [1, 1.5, 1],
                  rotate: [0, 10, -10, 0]
                } : {
                  scale: [1.2, 1]
                }}
                transition={isMilestone ? {
                  type: 'tween',
                  duration: 0.4,
                  ease: 'easeOut'
                } : {
                  type: 'spring',
                  stiffness: 300,
                  damping: 15
                }}
                className={cn("text-lg font-bold", hasGoodStreak && "text-orange-500")}
              >
                {currentStreak}
              </motion.span>
              <AnimatePresence>
                {hasGoodStreak && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 15
                    }}
                  >
                    <Badge variant="secondary" className="text-xs">
                      On Fire!
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Best Streak */}
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Best Streak</span>
            <motion.span
              key={bestStreak}
              initial={{ scale: 1 }}
              animate={{ scale: [1.3, 1] }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 10
              }}
              className="text-lg font-bold text-yellow-600 dark:text-yellow-500"
            >
              {bestStreak}
            </motion.span>
          </div>
        </div>
      </div>
    </Card>
  );
}
