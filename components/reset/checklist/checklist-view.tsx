'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertTriangle, TrendingUp, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ChecklistType, ChecklistItem as ChecklistItemType } from '@/types/reset';
import { ChecklistItem } from './checklist-item';

interface ChecklistViewProps {
  type: ChecklistType;
  items: ChecklistItemType[];
  onComplete: (checkedItems: string[]) => void;
}

const TYPE_CONFIG: Record<ChecklistType, { title: string; icon: React.ElementType; color: string; bgColor: string }> = {
  pre_trade: {
    title: 'Pre-Trade Checklist',
    icon: ClipboardList,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  post_loss: {
    title: 'Post-Loss Protocol',
    icon: AlertTriangle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
  post_win: {
    title: 'Post-Win Review',
    icon: TrendingUp,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
};

export function ChecklistView({ type, items, onComplete }: ChecklistViewProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const config = TYPE_CONFIG[type];
  const Icon = config.icon;
  const activeItems = items.filter((i) => i.isActive);
  const progress = (checkedItems.size / activeItems.length) * 100;
  const allChecked = checkedItems.size === activeItems.length;

  const handleToggle = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleComplete = () => {
    onComplete(Array.from(checkedItems));
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className={cn('inline-flex items-center justify-center w-16 h-16 rounded-full mb-4', config.bgColor)}>
          <Icon className={cn('w-8 h-8', config.color)} />
        </div>
        <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
        <p className="text-sm text-muted-foreground">
          Check each item as you verify it
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>{checkedItems.size} of {activeItems.length} checked</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Items */}
      <div className="space-y-3 mb-8">
        <AnimatePresence mode="popLayout">
          {activeItems.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              isChecked={checkedItems.has(item.id)}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Complete button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <Button
          onClick={handleComplete}
          disabled={!allChecked}
          className={cn('min-w-[200px]', allChecked && 'glow-green')}
        >
          {allChecked ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Complete Checklist
            </>
          ) : (
            `Check all items (${activeItems.length - checkedItems.size} remaining)`
          )}
        </Button>
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10"
      >
        <p className="text-sm text-muted-foreground text-center">
          <span className="text-foreground font-medium">Tip:</span>{' '}
          {type === 'pre_trade' && 'Only enter a trade if all items are checked.'}
          {type === 'post_loss' && 'Take your time. Processing losses properly prevents revenge trading.'}
          {type === 'post_win' && 'Stay humble. One win doesn\'t change your risk parameters.'}
        </p>
      </motion.div>
    </div>
  );
}
