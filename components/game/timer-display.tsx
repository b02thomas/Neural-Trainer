import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface TimerDisplayProps {
  elapsedTime: number;
  isRunning: boolean;
  className?: string;
  // Countdown mode props
  timeoutMs?: number;
  timeRemaining?: number;
}

export function TimerDisplay({
  elapsedTime,
  isRunning,
  className,
  timeoutMs,
  timeRemaining,
}: TimerDisplayProps) {
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
  };

  // Use countdown mode if timeoutMs and timeRemaining are provided
  const isCountdownMode = timeoutMs !== undefined && timeRemaining !== undefined;
  const displayTime = isCountdownMode ? timeRemaining : elapsedTime;

  // Calculate color based on time remaining percentage
  const getColorClass = () => {
    if (!isRunning) return 'text-muted-foreground';
    if (!isCountdownMode) return 'text-cyan-400';

    const percentRemaining = (timeRemaining! / timeoutMs!) * 100;
    if (percentRemaining <= 20) return 'text-red-400';
    if (percentRemaining <= 50) return 'text-yellow-400';
    return 'text-cyan-400';
  };

  const getBorderClass = () => {
    if (!isRunning) return '';
    if (!isCountdownMode) return 'border-cyan-500/30';

    const percentRemaining = (timeRemaining! / timeoutMs!) * 100;
    if (percentRemaining <= 20) return 'border-red-500/30';
    if (percentRemaining <= 50) return 'border-yellow-500/30';
    return 'border-cyan-500/30';
  };

  const colorClass = getColorClass();
  const borderClass = getBorderClass();

  // Add pulse animation when in danger zone
  const isDanger = isCountdownMode && isRunning && (timeRemaining! / timeoutMs!) <= 0.2;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "glass-card",
        borderClass,
        isDanger && "animate-pulse",
        className
      )}
    >
      <Clock className={cn("w-4 h-4", colorClass)} />
      <span className={cn("font-mono text-lg tabular-nums", colorClass)}>
        {formatTime(displayTime)}
        <span className="text-sm text-muted-foreground">s</span>
      </span>
    </div>
  );
}
