'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Wind, Activity, Sparkles, ChevronRight, Timer, Heart } from 'lucide-react';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { Button } from '@/components/ui/button';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

interface ExerciseCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: 'cyan' | 'purple' | 'green';
  features: string[];
}

function ExerciseCard({ title, description, icon: Icon, href, color, features }: ExerciseCardProps) {
  const colorClasses = {
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      glow: 'glow-cyan',
      icon: 'text-cyan-400',
      hover: 'hover:border-cyan-500/40',
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      glow: 'glow-purple',
      icon: 'text-purple-400',
      hover: 'hover:border-purple-500/40',
    },
    green: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      glow: '',
      icon: 'text-green-400',
      hover: 'hover:border-green-500/40',
    },
  };

  const c = colorClasses[color];

  return (
    <motion.div variants={fadeInUp}>
      <Link href={href}>
        <div className={`glass-card p-6 border ${c.border} ${c.hover} transition-all duration-300 group cursor-pointer h-full`}>
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-xl ${c.bg} ${c.glow}`}>
              <Icon className={`w-6 h-6 ${c.icon}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1 group-hover:text-foreground transition-colors">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {description}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>

          <div className="space-y-2">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className={`w-1.5 h-1.5 rounded-full ${c.bg.replace('/10', '/50')}`} />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function MeditatePage() {
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-4 h-4" />
              Mindfulness Training
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-purple-cyan">Meditation</span>
              <span className="text-foreground ml-3">Hub</span>
            </h1>

            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Train your mind with focused breathing exercises, body awareness practices,
              and open attention meditation.
            </p>
          </motion.div>

          {/* Status Bar */}
          <motion.div variants={fadeInUp}>
            <div className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-cyan-400 status-indicator" />
                <span className="text-sm text-muted-foreground">Ready for Practice</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-purple-400" />
                  <span className="text-muted-foreground">2-20 min sessions</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Exercise Cards */}
          <motion.div
            className="grid gap-6 md:grid-cols-1"
            variants={staggerContainer}
          >
            <ExerciseCard
              title="Box Breathing"
              description="Rhythmic breathing technique for focus and calm"
              icon={Wind}
              href="/meditate/breathe"
              color="cyan"
              features={[
                '4-4-4-4 or 4-7-8 breathing patterns',
                'Visual breathing guide with animated circle',
                'Tracks cycles completed',
              ]}
            />

            <ExerciseCard
              title="Body Scan"
              description="Progressive body awareness meditation"
              icon={Heart}
              href="/meditate/body-scan"
              color="purple"
              features={[
                '15 body regions from feet to head',
                'Guided prompts for each area',
                'Develops interoceptive awareness',
              ]}
            />

            <ExerciseCard
              title="Open Monitoring"
              description="Mindfulness meditation with thought awareness"
              icon={Activity}
              href="/meditate/open-monitoring"
              color="green"
              features={[
                'Minimal distraction interface',
                'Optional interval chimes',
                'Track thoughts noticed',
              ]}
            />
          </motion.div>

          {/* Quick Start */}
          <motion.div variants={fadeInUp} className="text-center">
            <p className="text-muted-foreground mb-4">
              New to meditation? Start with a 2-minute breathing session.
            </p>
            <Link href="/meditate/breathe">
              <Button className="glow-cyan">
                <Wind className="w-4 h-4 mr-2" />
                Start Breathing Exercise
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
