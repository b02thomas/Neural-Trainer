'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { GripVertical, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TradingRule, RuleCategory } from '@/types/reset';

interface RuleCardProps {
  rule: TradingRule;
  onEdit: (rule: TradingRule) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  isDragging?: boolean;
}

const CATEGORY_CONFIG: Record<RuleCategory, { color: string; bgColor: string; label: string }> = {
  entry: { color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', label: 'Entry' },
  exit: { color: 'text-purple-400', bgColor: 'bg-purple-500/10', label: 'Exit' },
  risk: { color: 'text-red-400', bgColor: 'bg-red-500/10', label: 'Risk' },
  emotional: { color: 'text-pink-400', bgColor: 'bg-pink-500/10', label: 'Emotional' },
  general: { color: 'text-amber-400', bgColor: 'bg-amber-500/10', label: 'General' },
};

export function RuleCard({ rule, onEdit, onDelete, onToggle, isDragging }: RuleCardProps) {
  const [showActions, setShowActions] = useState(false);
  const config = CATEGORY_CONFIG[rule.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        'group flex items-center gap-3 p-4 rounded-lg border transition-all duration-200',
        rule.isActive
          ? 'bg-white/5 border-white/10 hover:border-white/20'
          : 'bg-white/[0.02] border-white/5 opacity-60',
        isDragging && 'shadow-lg border-purple-500/30'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Drag handle */}
      <div className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Category badge */}
      <div
        className={cn(
          'shrink-0 px-2 py-0.5 rounded text-xs font-medium',
          config.bgColor,
          config.color
        )}
      >
        {config.label}
      </div>

      {/* Rule text */}
      <div className={cn('flex-1 text-sm', !rule.isActive && 'line-through')}>
        {rule.ruleText}
      </div>

      {/* Actions */}
      <div
        className={cn(
          'flex items-center gap-1 transition-opacity',
          showActions ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onToggle(rule.id)}
          title={rule.isActive ? 'Disable rule' : 'Enable rule'}
        >
          {rule.isActive ? (
            <ToggleRight className="w-4 h-4 text-green-400" />
          ) : (
            <ToggleLeft className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(rule)}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-400 hover:text-red-300"
          onClick={() => onDelete(rule.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
