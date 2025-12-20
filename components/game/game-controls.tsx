import { Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GameStatus } from '@/types/game';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface GameControlsProps {
  status: GameStatus;
  onStart?: () => void;
  onPause: () => void;
  onReset: () => void;
  className?: string;
}

export function GameControls({
  status,
  onPause,
  onReset,
  className,
}: GameControlsProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      {status === 'playing' && (
        <Button
          onClick={onPause}
          size="lg"
          variant="outline"
          className="gap-2 px-6 border-white/20 text-white/70 hover:text-white hover:bg-white/5 hover:border-purple-500/50"
        >
          <Pause className="w-4 h-4" />
          Pause
        </Button>
      )}

      {status !== 'idle' && status !== 'countdown' && (
        <Button
          onClick={onReset}
          size="lg"
          variant="outline"
          className="gap-2 border-red-500/30 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      )}
    </div>
  );
}

interface CountdownProps {
  count: number;
  className?: string;
}

export function Countdown({ count, className }: CountdownProps) {
  if (count <= 0) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center z-50",
        "bg-black/80 backdrop-blur-md",
        className
      )}
    >
      <motion.div
        key={count}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative"
      >
        {/* Outer ring */}
        <div className="absolute inset-0 -m-8 rounded-full border-2 border-purple-500/30 neural-pulse" />
        <div className="absolute inset-0 -m-16 rounded-full border border-cyan-500/20" />

        {/* Number */}
        <div
          className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-cyan-400"
          style={{
            textShadow: '0 0 60px rgba(168, 85, 247, 0.5), 0 0 120px rgba(6, 182, 212, 0.3)',
          }}
        >
          {count}
        </div>

        {/* Label */}
        <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm uppercase tracking-widest">
          Initializing
        </p>
      </motion.div>
    </div>
  );
}
