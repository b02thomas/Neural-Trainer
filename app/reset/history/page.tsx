'use client';

import { motion } from 'motion/react';
import { ArrowLeft, History } from 'lucide-react';
import Link from 'next/link';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { SessionList } from '@/components/reset/history';

export default function ResetHistoryPage() {
  return (
    <div className="min-h-screen neural-bg grid-overlay">
      <MegaMenu />
      <MegaMenuSpacer />

      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
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
              <History className="w-8 h-8 text-purple-400" />
            </div>

            <h1 className="text-3xl font-bold mb-2">Session History</h1>
            <p className="text-muted-foreground">
              Track your reset sessions and emotional progress over time
            </p>
          </motion.div>

          {/* Session list with filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SessionList />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
