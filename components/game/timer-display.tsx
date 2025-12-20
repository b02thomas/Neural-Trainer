import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface TimerDisplayProps {
  elapsedTime: number;
  isRunning: boolean;
  className?: string;
}

export function TimerDisplay({ elapsedTime, isRunning, className }: TimerDisplayProps) {
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "glass-card",
        isRunning && "border-cyan-500/30",
        className
      )}
    >
      <Clock className={cn(
        "w-4 h-4",
        isRunning ? "text-cyan-400" : "text-white/40"
      )} />
      <span
        className={cn(
          "font-mono text-lg tabular-nums",
          isRunning ? "text-cyan-400" : "text-white/40"
        )}
      >
        {formatTime(elapsedTime)}
        <span className="text-sm text-white/30">s</span>
      </span>
    </div>
  );
}
