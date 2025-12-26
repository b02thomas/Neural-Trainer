'use client';

import { motion } from 'motion/react';
import {
  TrendingUp,
  Dumbbell,
  Briefcase,
  Heart,
  Brain,
  Check,
} from 'lucide-react';
import { FocusArea, FOCUS_AREA_CONFIGS } from '@/types/coach';
import { cn } from '@/lib/utils';

const FOCUS_ICONS: Record<FocusArea, React.ElementType> = {
  trading: TrendingUp,
  fitness: Dumbbell,
  work: Briefcase,
  relationships: Heart,
  general: Brain,
};

const FOCUS_COLORS: Record<FocusArea, { bg: string; border: string; text: string }> = {
  trading: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', text: 'text-cyan-400' },
  fitness: { bg: 'bg-green-500/10', border: 'border-green-500/40', text: 'text-green-400' },
  work: { bg: 'bg-purple-500/10', border: 'border-purple-500/40', text: 'text-purple-400' },
  relationships: { bg: 'bg-pink-500/10', border: 'border-pink-500/40', text: 'text-pink-400' },
  general: { bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-400' },
};

interface FocusAreaSelectorProps {
  selected: FocusArea[];
  onChange: (areas: FocusArea[]) => void;
  className?: string;
}

export function FocusAreaSelector({
  selected,
  onChange,
  className,
}: FocusAreaSelectorProps) {
  const handleToggle = (area: FocusArea) => {
    if (selected.includes(area)) {
      // Don't allow removing the last one
      if (selected.length > 1) {
        onChange(selected.filter((a) => a !== area));
      }
    } else {
      onChange([...selected, area]);
    }
  };

  const areas = Object.values(FOCUS_AREA_CONFIGS);

  return (
    <div className={cn('space-y-3', className)}>
      {areas.map((area, index) => {
        const Icon = FOCUS_ICONS[area.id];
        const colors = FOCUS_COLORS[area.id];
        const isSelected = selected.includes(area.id);

        return (
          <motion.button
            key={area.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleToggle(area.id)}
            className={cn(
              'w-full flex items-center gap-4 p-4 rounded-xl transition-all',
              'border',
              isSelected
                ? `${colors.bg} ${colors.border}`
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                isSelected ? colors.bg : 'bg-white/10'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5',
                  isSelected ? colors.text : 'text-muted-foreground'
                )}
              />
            </div>

            <div className="flex-1 text-left">
              <div className="font-medium">{area.name}</div>
              <div className="text-sm text-muted-foreground">
                {area.description}
              </div>
            </div>

            <div
              className={cn(
                'w-6 h-6 rounded-full border flex items-center justify-center transition-colors',
                isSelected
                  ? `${colors.bg} ${colors.border}`
                  : 'border-white/20'
              )}
            >
              {isSelected && <Check className={cn('w-4 h-4', colors.text)} />}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
