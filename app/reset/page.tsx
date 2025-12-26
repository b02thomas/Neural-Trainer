'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Eye,
  HelpCircle,
  Wind,
  Dumbbell,
  Clock,
  ChevronRight,
  Zap,
  ListChecks,
  BookOpen,
  Timer,
  AlertTriangle,
  RefreshCw,
  History,
} from 'lucide-react';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { Button } from '@/components/ui/button';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
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

interface ResetCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: 'cyan' | 'purple' | 'green' | 'amber' | 'red';
  duration: string;
  features: string[];
  comingSoon?: boolean;
}

function ResetCard({
  title,
  description,
  icon: Icon,
  href,
  color,
  duration,
  features,
  comingSoon,
}: ResetCardProps) {
  const colorClasses = {
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      glow: 'glow-cyan',
      icon: 'text-cyan-400',
      hover: 'hover:border-cyan-500/40',
      badge: 'bg-cyan-500/20 text-cyan-400',
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      glow: 'glow-purple',
      icon: 'text-purple-400',
      hover: 'hover:border-purple-500/40',
      badge: 'bg-purple-500/20 text-purple-400',
    },
    green: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      glow: '',
      icon: 'text-green-400',
      hover: 'hover:border-green-500/40',
      badge: 'bg-green-500/20 text-green-400',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      glow: '',
      icon: 'text-amber-400',
      hover: 'hover:border-amber-500/40',
      badge: 'bg-amber-500/20 text-amber-400',
    },
    red: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      glow: '',
      icon: 'text-red-400',
      hover: 'hover:border-red-500/40',
      badge: 'bg-red-500/20 text-red-400',
    },
  };

  const c = colorClasses[color];

  const CardContent = (
    <div
      className={`glass-card p-6 border ${c.border} ${comingSoon ? 'opacity-60' : c.hover} transition-all duration-300 group cursor-pointer h-full relative`}
    >
      {comingSoon && (
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/10 text-xs text-muted-foreground">
          Coming Soon
        </div>
      )}
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-xl ${c.bg} ${c.glow}`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold group-hover:text-foreground transition-colors">
              {title}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge}`}>
              {duration}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        {!comingSoon && (
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        )}
      </div>

      <div className="space-y-2">
        {features.map((feature, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${c.bg.replace('/10', '/50')}`}
            />
            {feature}
          </div>
        ))}
      </div>
    </div>
  );

  if (comingSoon) {
    return <motion.div variants={fadeInUp}>{CardContent}</motion.div>;
  }

  return (
    <motion.div variants={fadeInUp}>
      <Link href={href}>{CardContent}</Link>
    </motion.div>
  );
}

export default function ResetPage() {
  return (
    <div className="min-h-screen neural-bg grid-overlay">
      <MegaMenu />
      <MegaMenuSpacer />

      <main className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          className="max-w-4xl mx-auto space-y-12"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <RefreshCw className="w-4 h-4" />
              Trader Recovery Tools
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-purple-cyan">Reset</span>
              <span className="text-foreground ml-3">Center</span>
            </h1>

            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Quick interventions to regain awareness and objectivity after a
              loss, missed trade, or emotional trigger.
            </p>
          </motion.div>

          {/* Status Bar */}
          <motion.div variants={fadeInUp}>
            <div className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-muted-foreground">
                  Feeling triggered? Start with a quick grounding exercise
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-purple-400" />
                  <span className="text-muted-foreground">30s - 60min</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Reset Section */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Quick Resets
              <span className="text-sm font-normal text-muted-foreground ml-2">
                30 seconds - 2 minutes
              </span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <ResetCard
                title="5-4-3-2-1 Grounding"
                description="Sensory grounding to break emotional loops"
                icon={Eye}
                href="/reset/quick/grounding"
                color="cyan"
                duration="30-60s"
                features={[
                  '5 things you see, 4 you touch...',
                  'Instantly breaks rumination',
                  'No equipment needed',
                ]}
              />

              <ResetCard
                title="Awareness Questions"
                description="Challenge your assumptions and plan"
                icon={HelpCircle}
                href="/reset/quick/questions"
                color="purple"
                duration="60-90s"
                features={[
                  '"Am I following my rules?"',
                  '"Is this revenge trading?"',
                  'Guided self-inquiry',
                ]}
              />

              <ResetCard
                title="Perspective Shift"
                description="See the bigger picture"
                icon={Clock}
                href="/reset/quick/perspective"
                color="amber"
                duration="30s"
                features={[
                  '"Will this matter in a week?"',
                  'Career perspective',
                  'Instant reframe',
                ]}
              />

              <ResetCard
                title="Quick Breathing"
                description="5 deep breaths to reset your nervous system"
                icon={Wind}
                href="/reset/quick/breathing"
                color="green"
                duration="60s"
                features={[
                  'Visual breathing guide',
                  'Activates parasympathetic',
                  'Links to full meditation',
                ]}
                comingSoon
              />

              <ResetCard
                title="Physical Reset"
                description="Stretch, eye break, or movement prompt"
                icon={Dumbbell}
                href="/reset/quick/physical"
                color="amber"
                duration="30-60s"
                features={[
                  '20-20-20 eye break rule',
                  'Quick shoulder rolls',
                  'Stand and walk prompt',
                ]}
              />
            </div>
          </motion.div>

          {/* Tools Section */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-purple-400" />
              Trading Tools
              <span className="text-sm font-normal text-muted-foreground ml-2">
                Checklists & Rules
              </span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <ResetCard
                title="Pre-Trade Checklist"
                description="Run through your rules before entering"
                icon={ListChecks}
                href="/reset/checklist/pre-trade"
                color="green"
                duration="2-3min"
                features={[
                  'Customizable checklist items',
                  'Logs completions for patterns',
                  'Prevents impulsive entries',
                ]}
              />

              <ResetCard
                title="Post-Loss Protocol"
                description="Process losses objectively"
                icon={AlertTriangle}
                href="/reset/checklist/post-loss"
                color="red"
                duration="3-5min"
                features={[
                  'Acceptance checklist',
                  'Revenge trading prevention',
                  'Learning extraction',
                ]}
              />

              <ResetCard
                title="Trading Rules"
                description="Your personal trading rules reminder"
                icon={BookOpen}
                href="/reset/rules"
                color="purple"
                duration="Quick view"
                features={[
                  'Create your own rules',
                  'Categorized by type',
                  'Quick reference during trading',
                ]}
              />

              <ResetCard
                title="Cooldown Timer"
                description="Force a break before your next trade"
                icon={Clock}
                href="/reset/cooldown"
                color="amber"
                duration="5-60min"
                features={[
                  'Prevents overtrading',
                  'Suggested activities',
                  'Tracks completion rate',
                ]}
              />
            </div>
          </motion.div>

          {/* Quick Start */}
          <motion.div variants={fadeInUp} className="text-center">
            <p className="text-muted-foreground mb-4">
              Just took a loss? Start with the 5-4-3-2-1 grounding exercise.
            </p>
            <Link href="/reset/quick/grounding">
              <Button className="glow-cyan">
                <Eye className="w-4 h-4 mr-2" />
                Start Grounding Exercise
              </Button>
            </Link>
          </motion.div>

          {/* Session History */}
          <motion.div variants={fadeInUp}>
            <div className="glass-card p-6 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-purple-500/10">
                    <History className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Session History</h3>
                    <p className="text-sm text-muted-foreground">
                      View past sessions and track your emotional progress
                    </p>
                  </div>
                </div>
                <Link href="/reset/history">
                  <Button variant="outline">
                    View History
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Link to Meditation */}
          <motion.div variants={fadeInUp}>
            <div className="glass-card p-6 border border-cyan-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10">
                    <Wind className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Need a Deeper Reset?</h3>
                    <p className="text-sm text-muted-foreground">
                      Try a 5-15 minute meditation session for complete mental
                      reset
                    </p>
                  </div>
                </div>
                <Link href="/meditate">
                  <Button variant="outline">
                    Go to Meditation
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
