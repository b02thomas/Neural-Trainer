'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ClipboardList, AlertTriangle, TrendingUp, Settings, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { ChecklistEditor } from '@/components/reset/checklist';
import { useResetStore } from '@/stores/reset-store';
import { ChecklistType, DEFAULT_CHECKLIST_ITEMS } from '@/types/reset';
import { cn } from '@/lib/utils';

type Tab = 'pre_trade' | 'post_loss' | 'post_win';

const TABS: { value: Tab; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'pre_trade', label: 'Pre-Trade', icon: ClipboardList, color: 'text-green-400' },
  { value: 'post_loss', label: 'Post-Loss', icon: AlertTriangle, color: 'text-red-400' },
  { value: 'post_win', label: 'Post-Win', icon: TrendingUp, color: 'text-amber-400' },
];

export default function ChecklistHubPage() {
  const [activeTab, setActiveTab] = useState<Tab>('pre_trade');
  const [showInitPrompt, setShowInitPrompt] = useState(false);

  const {
    checklists,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    reorderChecklist,
    initializeDefaultChecklists,
  } = useResetStore();

  useEffect(() => {
    const hasNoItems = Object.values(checklists).every((items) => items.length === 0);
    if (hasNoItems) {
      setShowInitPrompt(true);
    }
  }, [checklists]);

  const handleInitialize = () => {
    initializeDefaultChecklists();
    setShowInitPrompt(false);
  };

  const handleSkipInit = () => {
    setShowInitPrompt(false);
  };

  const totalItems = Object.values(checklists).reduce((sum, items) => sum + items.length, 0);

  return (
    <div className="min-h-screen neural-bg grid-overlay">
      <MegaMenu />
      <MegaMenuSpacer />

      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <div className="mb-8">
            <Link href="/reset">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Reset Hub
              </Button>
            </Link>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
              <Settings className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Checklist Editor</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Customize your trading checklists. Use them before trades, after losses,
              or after wins.
            </p>
          </motion.div>

          {/* Init prompt */}
          {showInitPrompt && totalItems === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 mb-8 text-center"
            >
              <Sparkles className="w-10 h-10 mx-auto text-amber-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">Start with Default Checklists?</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                We have proven checklist items for pre-trade, post-loss, and post-win scenarios.
                You can customize them anytime.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleSkipInit}>
                  Start Empty
                </Button>
                <Button onClick={handleInitialize} className="glow-amber">
                  Use Defaults
                </Button>
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 mb-6 overflow-x-auto pb-2"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.value;
              const itemCount = checklists[tab.value].length;

              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap',
                    isActive
                      ? 'bg-white/10 border border-white/20'
                      : 'bg-white/5 border border-transparent hover:bg-white/10'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? tab.color : 'text-muted-foreground')} />
                  <span className={isActive ? 'text-foreground' : 'text-muted-foreground'}>
                    {tab.label}
                  </span>
                  <span className={cn(
                    'text-xs px-1.5 py-0.5 rounded',
                    isActive ? 'bg-white/10' : 'bg-white/5'
                  )}>
                    {itemCount}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Quick use links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 mb-8"
          >
            <Link href={`/reset/checklist/${activeTab.replace('_', '-')}`} className="flex-1">
              <Button variant="outline" className="w-full">
                <ClipboardList className="w-4 h-4 mr-2" />
                Use {TABS.find((t) => t.value === activeTab)?.label} Checklist
              </Button>
            </Link>
          </motion.div>

          {/* Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <ChecklistEditor
              type={activeTab}
              items={checklists[activeTab]}
              onAddItem={(text) => addChecklistItem(activeTab, text)}
              onUpdateItem={(id, updates) => updateChecklistItem(activeTab, id, updates)}
              onDeleteItem={(id) => deleteChecklistItem(activeTab, id)}
              onReorder={(ids) => reorderChecklist(activeTab, ids)}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
