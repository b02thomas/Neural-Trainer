'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Save, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChecklistType, ChecklistItem as ChecklistItemType } from '@/types/reset';
import { ChecklistItem } from './checklist-item';

interface ChecklistEditorProps {
  type: ChecklistType;
  items: ChecklistItemType[];
  onAddItem: (itemText: string) => void;
  onUpdateItem: (id: string, updates: Partial<ChecklistItemType>) => void;
  onDeleteItem: (id: string) => void;
  onReorder: (itemIds: string[]) => void;
}

const TYPE_CONFIG: Record<ChecklistType, { title: string; description: string }> = {
  pre_trade: {
    title: 'Pre-Trade Checklist',
    description: 'Items to verify before entering any trade',
  },
  post_loss: {
    title: 'Post-Loss Protocol',
    description: 'Steps to process a losing trade healthily',
  },
  post_win: {
    title: 'Post-Win Review',
    description: 'Keep yourself grounded after a winning trade',
  },
};

export function ChecklistEditor({
  type,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: ChecklistEditorProps) {
  const [newItemText, setNewItemText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const config = TYPE_CONFIG[type];
  const sortedItems = [...items].sort((a, b) => a.orderIndex - b.orderIndex);

  const handleAdd = () => {
    if (newItemText.trim()) {
      onAddItem(newItemText.trim());
      setNewItemText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const handleStartEdit = (item: ChecklistItemType) => {
    setEditingId(item.id);
    setEditText(item.itemText);
  };

  const handleSaveEdit = () => {
    if (editingId && editText.trim()) {
      onUpdateItem(editingId, { itemText: editText.trim() });
    }
    setEditingId(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">{config.title}</h3>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {items.length} items
        </div>
      </div>

      {/* Add new item */}
      <div className="flex gap-2">
        <Input
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add new checklist item..."
          className="flex-1 bg-white/5"
        />
        <Button
          onClick={handleAdd}
          disabled={!newItemText.trim()}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {/* Items list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {sortedItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {editingId === item.id ? (
                <div className="flex gap-2 p-3 rounded-lg bg-white/5 border border-purple-500/30">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    className="flex-1 bg-white/5"
                    autoFocus
                  />
                  <Button size="icon" onClick={handleSaveEdit}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <ChecklistItem
                  item={item}
                  isChecked={false}
                  onToggle={() => onUpdateItem(item.id, { isActive: !item.isActive })}
                  showControls
                  onEdit={() => handleStartEdit(item)}
                  onDelete={() => onDeleteItem(item.id)}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <Settings className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h4 className="font-medium mb-2">No items yet</h4>
          <p className="text-sm text-muted-foreground">
            Add your first checklist item above
          </p>
        </motion.div>
      )}
    </div>
  );
}
