'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  MessageSquare,
  Plus,
  Clock,
  Trash2,
  ChevronRight,
  Settings,
  Brain,
} from 'lucide-react';
import Link from 'next/link';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { useCoachStore, getConversationPreview, getFocusAreaColor } from '@/stores/coach-store';
import { FOCUS_AREA_CONFIGS } from '@/types/coach';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export default function CoachHubPage() {
  const router = useRouter();
  const {
    preferences,
    conversations,
    startNewConversation,
    loadConversation,
    deleteConversation,
  } = useCoachStore();

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!preferences.onboardingCompleted) {
      router.push('/coach/onboarding');
    }
  }, [preferences.onboardingCompleted, router]);

  if (!preferences.onboardingCompleted) {
    return null;
  }

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  const handleNewConversation = () => {
    startNewConversation();
    router.push('/coach/chat');
  };

  const handleOpenConversation = (conversation: typeof conversations[0]) => {
    loadConversation(conversation);
    router.push('/coach/chat');
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteConversation(id);
  };

  return (
    <div className="min-h-screen neural-bg grid-overlay">
      <MegaMenu />
      <MegaMenuSpacer />

      <main className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          className="max-w-2xl mx-auto space-y-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Brain className="w-4 h-4" />
              AI Psychology Coach
            </motion.div>

            <h1 className="text-4xl font-bold mb-4">
              <span className="text-gradient-purple-cyan">Coach</span>
              <span className="text-foreground ml-3">Hub</span>
            </h1>

            <p className="text-muted-foreground max-w-md mx-auto">
              Your AI-powered psychology coach for building mental resilience and
              working through challenges.
            </p>
          </motion.div>

          {/* New Conversation Button */}
          <motion.div variants={fadeInUp}>
            <Button
              onClick={handleNewConversation}
              className="w-full glow-cyan py-6 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start New Conversation
            </Button>
          </motion.div>

          {/* Focus Areas Summary */}
          <motion.div variants={fadeInUp}>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    Your focus areas:
                  </span>
                  <div className="flex gap-2">
                    {preferences.focusAreas.map((area) => {
                      const color = getFocusAreaColor(area);
                      return (
                        <span
                          key={area}
                          className={cn(
                            'px-2 py-1 rounded-full text-xs',
                            `bg-${color}-500/20 text-${color}-400`
                          )}
                        >
                          {FOCUS_AREA_CONFIGS[area].name}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <Link href="/coach/onboarding">
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Recent Conversations */}
          {sortedConversations.length > 0 && (
            <motion.div variants={fadeInUp} className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Recent Conversations
              </h2>

              <div className="space-y-3">
                {sortedConversations.slice(0, 10).map((conversation) => {
                  const color = getFocusAreaColor(conversation.focusArea);
                  return (
                    <motion.button
                      key={conversation.id}
                      onClick={() => handleOpenConversation(conversation)}
                      className={cn(
                        'w-full glass-card p-4 text-left transition-all group',
                        'hover:border-white/20 border border-transparent'
                      )}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium truncate">
                              {conversation.title}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {getConversationPreview(conversation)}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded-full text-xs',
                                `bg-${color}-500/20 text-${color}-400`
                              )}
                            >
                              {FOCUS_AREA_CONFIGS[conversation.focusArea].name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(conversation.updatedAt)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {conversation.messages.length} messages
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) =>
                              handleDeleteConversation(e, conversation.id)
                            }
                            className="p-2 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Delete conversation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {sortedConversations.length === 0 && (
            <motion.div
              variants={fadeInUp}
              className="text-center py-12 glass-card"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">No conversations yet</h3>
              <p className="text-sm text-muted-foreground">
                Start a new conversation to begin working with your AI coach.
              </p>
            </motion.div>
          )}

          {/* Link to Reset Tools */}
          <motion.div variants={fadeInUp}>
            <Link href="/reset">
              <div className="glass-card p-6 border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-amber-500/10">
                      <Clock className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Need a Quick Reset?</h3>
                      <p className="text-sm text-muted-foreground">
                        Try a grounding exercise or cooldown timer
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
