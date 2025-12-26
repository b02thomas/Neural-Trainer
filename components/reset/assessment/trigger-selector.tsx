'use client';

import { motion } from 'motion/react';
import {
  TrendingDown,
  Clock,
  Zap,
  Repeat,
  BarChart3,
  Frown,
  AlertTriangle,
  Hand,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TriggerType } from '@/types/reset';

interface TriggerSelectorProps {
  value: TriggerType | null;
  onChange: (value: TriggerType | null) => void;
  disabled?: boolean;
}

const TRIGGER_CONFIG: Array<{
  id: TriggerType;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
}> = [
  {
    id: 'loss',
    label: 'Loss',
    icon: TrendingDown,
    color: 'red',
    description: 'Took a losing trade',
  },
  {
    id: 'missed_trade',
    label: 'Missed Trade',
    icon: Clock,
    color: 'orange',
    description: 'Missed an opportunity',
  },
  {
    id: 'fomo',
    label: 'FOMO',
    icon: Zap,
    color: 'yellow',
    description: 'Fear of missing out',
  },
  {
    id: 'revenge_trading',
    label: 'Revenge',
    icon: Repeat,
    color: 'red',
    description: 'Urge to revenge trade',
  },
  {
    id: 'overtrading',
    label: 'Overtrading',
    icon: BarChart3,
    color: 'purple',
    description: 'Trading too much',
  },
  {
    id: 'frustration',
    label: 'Frustration',
    icon: Frown,
    color: 'orange',
    description: 'Feeling frustrated',
  },
  {
    id: 'anxiety',
    label: 'Anxiety',
    icon: AlertTriangle,
    color: 'amber',
    description: 'Feeling anxious',
  },
  {
    id: 'manual',
    label: 'Manual Reset',
    icon: Hand,
    color: 'cyan',
    description: 'Proactive reset',
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
  red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
};

export function TriggerSelector({
  value,
  onChange,
  disabled = false,
}: TriggerSelectorProps) {
  const handleSelect = (triggerId: TriggerType) => {
    if (disabled) return;
    // Toggle off if already selected
    onChange(value === triggerId ? null : triggerId);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <label className="block text-center text-lg font-medium mb-4">
        What triggered this? <span className="text-muted-foreground text-sm">(optional)</span>
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TRIGGER_CONFIG.map((trigger) => {
          const isSelected = value === trigger.id;
          const colors = colorClasses[trigger.color];
          const Icon = trigger.icon;

          return (
            <motion.button
              key={trigger.id}
              onClick={() => handleSelect(trigger.id)}
              disabled={disabled}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              className={cn(
                'p-3 rounded-xl border-2 transition-all duration-200',
                'flex flex-col items-center gap-2',
                isSelected
                  ? `${colors.bg} ${colors.border}`
                  : 'bg-white/5 border-white/10 hover:border-white/20',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div
                className={cn(
                  'p-2 rounded-lg',
                  isSelected ? colors.bg : 'bg-white/5'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5',
                    isSelected ? colors.text : 'text-muted-foreground'
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  isSelected ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {trigger.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {value && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4"
        >
          <p className="text-sm text-muted-foreground">
            {TRIGGER_CONFIG.find((t) => t.id === value)?.description}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// Compact inline version
export function TriggerBadge({ trigger }: { trigger: TriggerType }) {
  const config = TRIGGER_CONFIG.find((t) => t.id === trigger);
  if (!config) return null;

  const colors = colorClasses[config.color];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
        colors.bg,
        colors.text
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}
