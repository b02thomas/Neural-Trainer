import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

interface SpeedBadgeProps {
  speedLevel: string;
  className?: string;
}

export function SpeedBadge({ speedLevel, className }: SpeedBadgeProps) {
  // Get color based on speed level
  const getColorClasses = () => {
    switch (speedLevel) {
      case '5x':
        return {
          text: 'text-red-400',
          border: 'border-red-500/30',
          glow: 'shadow-red-500/20',
        };
      case '3.3x':
        return {
          text: 'text-orange-400',
          border: 'border-orange-500/30',
          glow: 'shadow-orange-500/20',
        };
      case '2.5x':
        return {
          text: 'text-yellow-400',
          border: 'border-yellow-500/30',
          glow: 'shadow-yellow-500/20',
        };
      case '1.67x':
        return {
          text: 'text-green-400',
          border: 'border-green-500/30',
          glow: 'shadow-green-500/20',
        };
      case '1.25x':
        return {
          text: 'text-cyan-400',
          border: 'border-cyan-500/30',
          glow: 'shadow-cyan-500/20',
        };
      default:
        return {
          text: 'text-white/60',
          border: 'border-white/20',
          glow: '',
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
        "glass-card border",
        colors.border,
        speedLevel !== '1x' && "shadow-lg",
        colors.glow,
        className
      )}
    >
      <Zap className={cn("w-3.5 h-3.5", colors.text)} />
      <span className={cn("font-mono text-sm font-medium", colors.text)}>
        {speedLevel}
      </span>
    </div>
  );
}
