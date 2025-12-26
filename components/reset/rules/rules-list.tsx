'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { TradingRule, RuleCategory } from '@/types/reset';
import { RuleCard } from './rule-card';
import { RuleEditor } from './rule-editor';

interface RulesListProps {
  rules: TradingRule[];
  onAddRule: (rule: Omit<TradingRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateRule: (id: string, updates: Partial<TradingRule>) => void;
  onDeleteRule: (id: string) => void;
  onToggleRule: (id: string) => void;
}

const CATEGORY_FILTERS: { value: RuleCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'entry', label: 'Entry' },
  { value: 'exit', label: 'Exit' },
  { value: 'risk', label: 'Risk' },
  { value: 'emotional', label: 'Emotional' },
  { value: 'general', label: 'General' },
];

export function RulesList({
  rules,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
  onToggleRule,
}: RulesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<RuleCategory | 'all'>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TradingRule | null>(null);

  const filteredRules = useMemo(() => {
    return rules
      .filter((rule) => {
        if (categoryFilter !== 'all' && rule.category !== categoryFilter) {
          return false;
        }
        if (searchQuery && !rule.ruleText.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.priority - b.priority);
  }, [rules, categoryFilter, searchQuery]);

  const groupedRules = useMemo(() => {
    const groups: Record<RuleCategory, TradingRule[]> = {
      entry: [],
      exit: [],
      risk: [],
      emotional: [],
      general: [],
    };

    filteredRules.forEach((rule) => {
      groups[rule.category].push(rule);
    });

    return groups;
  }, [filteredRules]);

  const handleEdit = (rule: TradingRule) => {
    setEditingRule(rule);
    setIsEditorOpen(true);
  };

  const handleSave = (ruleData: Omit<TradingRule, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    if (ruleData.id) {
      onUpdateRule(ruleData.id, {
        ruleText: ruleData.ruleText,
        category: ruleData.category,
        priority: ruleData.priority,
      });
    } else {
      onAddRule(ruleData);
    }
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingRule(null);
  };

  const handleAddNew = () => {
    setEditingRule(null);
    setIsEditorOpen(true);
  };

  const activeRulesCount = rules.filter((r) => r.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-xl font-bold">Your Trading Rules</h2>
          <p className="text-sm text-muted-foreground">
            {activeRulesCount} active rules • {rules.length} total
          </p>
        </div>
        <Button onClick={handleAddNew} className="glow-purple">
          <Plus className="w-4 h-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules..."
            className="pl-10 bg-white/5"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {CATEGORY_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setCategoryFilter(filter.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                categoryFilter === filter.value
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rules list */}
      {categoryFilter === 'all' ? (
        // Grouped view
        <div className="space-y-6">
          {(Object.entries(groupedRules) as [RuleCategory, TradingRule[]][]).map(
            ([category, categoryRules]) => {
              if (categoryRules.length === 0) return null;

              return (
                <div key={category}>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    {category.replace('_', ' ')} Rules ({categoryRules.length})
                  </h3>
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {categoryRules.map((rule) => (
                        <RuleCard
                          key={rule.id}
                          rule={rule}
                          onEdit={handleEdit}
                          onDelete={onDeleteRule}
                          onToggle={onToggleRule}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            }
          )}
        </div>
      ) : (
        // Flat view for single category
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredRules.map((rule) => (
              <RuleCard
                key={rule.id}
                rule={rule}
                onEdit={handleEdit}
                onDelete={onDeleteRule}
                onToggle={onToggleRule}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty state */}
      {filteredRules.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Filter className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-medium mb-2">No rules found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery || categoryFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Start by adding your first trading rule'}
          </p>
          {rules.length === 0 && (
            <Button onClick={handleAddNew} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Rule
            </Button>
          )}
        </motion.div>
      )}

      {/* Editor modal */}
      <RuleEditor
        rule={editingRule}
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSave}
      />
    </div>
  );
}
