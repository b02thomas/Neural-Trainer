'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Settings } from 'lucide-react';
import Link from 'next/link';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { ChatContainer } from '@/components/coach/chat';
import { useCoachStore } from '@/stores/coach-store';
import { Button } from '@/components/ui/button';

export default function CoachChatPage() {
  const router = useRouter();
  const { preferences, startNewConversation, currentConversation } = useCoachStore();

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!preferences.onboardingCompleted) {
      router.push('/coach/onboarding');
    }
  }, [preferences.onboardingCompleted, router]);

  // Start a new conversation if none exists
  useEffect(() => {
    if (preferences.onboardingCompleted && !currentConversation) {
      startNewConversation();
    }
  }, [preferences.onboardingCompleted, currentConversation, startNewConversation]);

  if (!preferences.onboardingCompleted) {
    return null; // Will redirect
  }

  return (
    <div className="h-screen flex flex-col neural-bg grid-overlay">
      <MegaMenu />
      <MegaMenuSpacer />

      {/* Header */}
      <div className="flex-shrink-0 border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/coach">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Hub
                </Button>
              </Link>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground"
              >
                {currentConversation?.title || 'New Conversation'}
              </motion.span>
            </div>

            <Link href="/coach/onboarding">
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Chat container - fills remaining height */}
      <div className="flex-1 min-h-0">
        <div className="h-full container mx-auto max-w-3xl">
          <ChatContainer className="h-full" />
        </div>
      </div>
    </div>
  );
}
