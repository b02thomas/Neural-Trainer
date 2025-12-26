'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { TradingRule, RuleCategory } from '@/types/reset';

interface RuleEditorProps {
  rule?: TradingRule | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: Omit<TradingRule, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
}

const CATEGORIES: { value: RuleCategory; label: string; color: string }[] = [
  { value: 'entry', label: 'Entry', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  { value: 'exit', label: 'Exit', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  { value: 'risk', label: 'Risk', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
  { value: 'emotional', label: 'Emotional', color: 'bg-pink-500/10 text-pink-400 border-pink-500/30' },
  { value: 'general', label: 'General', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
];

export function RuleEditor({ rule, isOpen, onClose, onSave }: RuleEditorProps) {
  const [ruleText, setRuleText] = useState('');
  const [category, setCategory] = useState<RuleCategory>('general');
  const [priority, setPriority] = useState(1);

  const isEditing = !!rule;

  useEffect(() => {
    if (rule) {
      setRuleText(rule.ruleText);
      setCategory(rule.category);
      setPriority(rule.priority);
    } else {
      setRuleText('');
      setCategory('general');
      setPriority(1);
    }
  }, [rule, isOpen]);

  const handleSave = () => {
    if (!ruleText.trim()) return;

    onSave({
      id: rule?.id,
      ruleText: ruleText.trim(),
      category,
      priority,
      isActive: rule?.isActive ?? true,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg glass-card p-6 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {isEditing ? 'Edit Rule' : 'Add New Rule'}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Rule text */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Rule
                </label>
                <Input
                  value={ruleText}
                  onChange={(e) => setRuleText(e.target.value)}
                  placeholder="e.g., Never risk more than 1% per trade"
                  className="bg-white/5"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                        category === cat.value
                          ? cat.color
                          : 'bg-white/5 text-muted-foreground border-white/10 hover:border-white/20'
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Priority (1 = highest)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={cn(
                        'w-10 h-10 rounded-lg font-medium transition-all',
                        priority === p
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!ruleText.trim()}
                className="glow-purple"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rule
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
