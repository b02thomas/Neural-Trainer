'use client';

import { motion } from 'motion/react';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { OnboardingWizard } from '@/components/coach/onboarding';

export default function CoachOnboardingPage() {
  return (
    <div className="min-h-screen neural-bg grid-overlay">
      <MegaMenu />
      <MegaMenuSpacer />

      <main className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <OnboardingWizard />
        </motion.div>
      </main>
    </div>
  );
}
