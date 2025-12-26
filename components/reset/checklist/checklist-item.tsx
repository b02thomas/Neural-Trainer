'use client';

import { motion } from 'motion/react';
import { Check, GripVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChecklistItem as ChecklistItemType } from '@/types/reset';

interface ChecklistItemProps {
  item: ChecklistItemType;
  isChecked: boolean;
  onToggle: () => void;
  showControls?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ChecklistItem({
  item,
  isChecked,
  onToggle,
  showControls = false,
  onEdit,
  onDelete,
}: ChecklistItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={cn(
        'group flex items-center gap-3 p-4 rounded-lg border transition-all duration-200',
        isChecked
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-white/5 border-white/10 hover:border-white/20'
      )}
    >
      {showControls && (
        <div className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground">
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={cn(
          'shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all',
          isChecked
            ? 'bg-green-500 border-green-500'
            : 'border-white/30 hover:border-white/50'
        )}
      >
        {isChecked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </button>

      {/* Item text */}
      <span
        className={cn(
          'flex-1 text-sm transition-all',
          isChecked && 'line-through text-muted-foreground'
        )}
      >
        {item.itemText}
      </span>

      {/* Edit controls */}
      {showControls && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onEdit}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-400 hover:text-red-300"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
