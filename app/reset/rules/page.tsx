'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { RulesList } from '@/components/reset/rules';
import { useResetStore } from '@/stores/reset-store';
import { DEFAULT_TRADING_RULES } from '@/types/reset';

export default function TradingRulesPage() {
  const {
    tradingRules,
    addTradingRule,
    updateTradingRule,
    deleteTradingRule,
    toggleTradingRule,
    initializeDefaultRules,
  } = useResetStore();

  const [showInitPrompt, setShowInitPrompt] = useState(false);

  useEffect(() => {
    // Check if user has no rules and hasn't dismissed the prompt
    if (tradingRules.length === 0) {
      setShowInitPrompt(true);
    }
  }, [tradingRules.length]);

  const handleInitialize = () => {
    initializeDefaultRules();
    setShowInitPrompt(false);
  };

  const handleSkipInit = () => {
    setShowInitPrompt(false);
  };

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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 mb-4">
              <BookOpen className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Trading Rules</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your personal trading rules. Review them before trading and when
              you feel emotional.
            </p>
          </motion.div>

          {/* Init prompt for new users */}
          {showInitPrompt && tradingRules.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 mb-8 text-center"
            >
              <Sparkles className="w-10 h-10 mx-auto text-amber-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">Start with Default Rules?</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                We have {DEFAULT_TRADING_RULES.length} proven trading rules to get you started.
                You can customize them anytime.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleSkipInit}>
                  Start Empty
                </Button>
                <Button onClick={handleInitialize} className="glow-amber">
                  Use Default Rules
                </Button>
              </div>
            </motion.div>
          )}

          {/* Rules list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <RulesList
              rules={tradingRules}
              onAddRule={addTradingRule}
              onUpdateRule={updateTradingRule}
              onDeleteRule={deleteTradingRule}
              onToggleRule={toggleTradingRule}
            />
          </motion.div>

          {/* Quick access tip */}
          {tradingRules.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10 text-center"
            >
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">Tip:</span>{' '}
                Review your rules before every trading session and when you feel
                the urge to break them.
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
