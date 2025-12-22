'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Brain, Target, Zap, BarChart3, Sparkles, ChevronRight, Wind, Heart, Activity, Flame, Eye } from 'lucide-react';
import { MegaMenu, MegaMenuSpacer } from '@/components/navigation';
import { HeroCard, HeroTitle, HeroSubtitle, HeroGradientText } from '@/components/landing/hero-card';
import { ActivityFeed } from '@/components/landing/activity-feed';
import { ActionCard, ActionCardsRow } from '@/components/ui/action-card';

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

export default function HomePage() {
  return (
    <div className="min-h-screen neural-bg grid-overlay">
      <MegaMenu />
      <MegaMenuSpacer />

      <main className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          className="max-w-5xl mx-auto space-y-16"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div variants={fadeInUp} transition={{ duration: 0.6 }}>
            <HeroCard className="text-center">
              {/* Activity Feed - Agent Status */}
              <div className="flex justify-center mb-8">
                <ActivityFeed className="max-w-xs" />
              </div>

              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles className="w-4 h-4" />
                High-Performance Neural Interface
              </motion.div>

              {/* Title */}
              <HeroTitle className="mb-6">
                <span className="block text-foreground">Cognitive</span>
                <HeroGradientText>Dissonance Trainer</HeroGradientText>
              </HeroTitle>

              {/* Subtitle */}
              <HeroSubtitle className="mx-auto mb-8">
                Train your cognitive control with the <strong className="text-foreground">Stroop Effect</strong>.
                Build mental resilience and improve reaction times through neural pathway optimization.
              </HeroSubtitle>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/play">
                  <Button size="lg" className="text-lg px-8 py-6 w-full sm:w-auto group relative overflow-hidden glow-purple">
                    <Brain className="w-5 h-5 mr-2" />
                    Start Training
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/stats">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 w-full sm:w-auto glass-card border-white/10 hover:border-purple-500/30"
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Statistics
                  </Button>
                </Link>
              </div>
            </HeroCard>
          </motion.div>

          {/* Action Cards Row */}
          <motion.div variants={fadeInUp} transition={{ duration: 0.6 }}>
            <ActionCardsRow>
              <ActionCard
                icon={Brain}
                title="Neural Training"
                description="Strengthen cognitive pathways"
                href="/play"
                iconColor="purple"
              />
              <ActionCard
                icon={Wind}
                title="Meditation"
                description="Breathe & focus"
                href="/meditate"
                iconColor="cyan"
              />
              <ActionCard
                icon={Zap}
                title="Reaction Time"
                description="Improve response speed"
                href="/play"
                iconColor="purple"
              />
              <ActionCard
                icon={BarChart3}
                title="Analytics"
                description="Track your progress"
                href="/stats"
                iconColor="cyan"
              />
            </ActionCardsRow>
          </motion.div>

          {/* Info Section - Stroop Effect */}
          <motion.div variants={fadeInUp} transition={{ duration: 0.6 }}>
            <div className="bento-card p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-purple-500/10 glow-purple">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">The Stroop Effect</h2>
                  <p className="text-muted-foreground text-sm">A classic test of cognitive interference</p>
                </div>
              </div>

              <div className="space-y-4 text-muted-foreground">
                <p>
                  In the Stroop test, you see <strong className="text-foreground">color words</strong> (like RED, BLUE)
                  written in a <strong className="text-foreground">different ink color</strong>.
                  Your task: name the ink color, <em className="text-cyan-400">not</em> the word.
                </p>
                <p>
                  It&apos;s harder than it sounds! Your brain automatically wants to read the word,
                  but you must control these impulses and focus on the color.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {[
                  { icon: Target, color: 'cyan', title: 'Train Focus', desc: 'Improve concentration and attention' },
                  { icon: Zap, color: 'purple', title: 'Reaction Time', desc: 'Measure speed in milliseconds' },
                  { icon: BarChart3, color: 'cyan', title: 'Progress', desc: 'Track improvement with statistics' }
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bento-card p-5 text-center"
                  >
                    <div className={`p-3 rounded-xl mb-4 inline-flex ${
                      item.color === 'cyan' ? 'bg-cyan-500/10' : 'bg-purple-500/10'
                    }`}>
                      <item.icon className={`w-6 h-6 ${
                        item.color === 'cyan' ? 'text-cyan-400' : 'text-purple-400'
                      }`} />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* How to Play */}
          <motion.div variants={fadeInUp} transition={{ duration: 0.6 }}>
            <div className="bento-card p-8 md:p-10">
              <h2 className="text-2xl font-bold mb-8">How It Works</h2>

              <div className="space-y-6">
                {[
                  { step: 1, title: 'You see a color word in a different color', desc: 'E.g., the word "RED" written in blue ink' },
                  { step: 2, title: 'Identify the INK COLOR (not the word!)', desc: 'In our example, the correct answer would be "BLUE"' },
                  { step: 3, title: 'Select the color as fast as possible', desc: 'Use the color buttons or keyboard (1-5 or R, B, G, Y, K)' }
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    className="flex gap-4 items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-purple-500/25">
                      {item.step}
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Meditation Preview Section */}
          <motion.div variants={fadeInUp} transition={{ duration: 0.6 }}>
            <div className="bento-card p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-cyan-500/10">
                  <Wind className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Mindful Training</h2>
                  <p className="text-muted-foreground text-sm">Complement your cognitive training with meditation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { icon: Wind, color: 'cyan', title: 'Breathing', desc: 'Box breathing & 4-7-8 patterns for relaxation' },
                  { icon: Heart, color: 'purple', title: 'Body Scan', desc: '15-region guided body awareness meditation' },
                  { icon: Activity, color: 'green', title: 'Open Monitoring', desc: 'Mindfulness practice with thought tracking' }
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bento-card p-5 text-center"
                  >
                    <div className={`p-3 rounded-xl mb-4 inline-flex ${
                      item.color === 'cyan' ? 'bg-cyan-500/10' :
                      item.color === 'purple' ? 'bg-purple-500/10' : 'bg-green-500/10'
                    }`}>
                      <item.icon className={`w-6 h-6 ${
                        item.color === 'cyan' ? 'text-cyan-400' :
                        item.color === 'purple' ? 'text-purple-400' : 'text-green-400'
                      }`} />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link href="/meditate">
                  <Button variant="outline" className="glass-card border-white/10 hover:border-cyan-500/30">
                    <Wind className="w-4 h-4 mr-2" />
                    Explore Meditation
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Cognitive Benefits Section */}
          <motion.div variants={fadeInUp} transition={{ duration: 0.6 }}>
            <div className="bento-card p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-purple-500/10 glow-purple">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Cognitive Benefits</h2>
                  <p className="text-muted-foreground text-sm">What regular training can do for your brain</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Target, color: 'cyan', title: 'Improved Focus', desc: 'Enhanced concentration and attention span' },
                  { icon: Zap, color: 'purple', title: 'Faster Reactions', desc: 'Reduced response time in decisions' },
                  { icon: Flame, color: 'cyan', title: 'Stress Reduction', desc: 'Calmer mind through mindfulness' },
                  { icon: Eye, color: 'purple', title: 'Mental Clarity', desc: 'Better cognitive control' }
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bento-card p-5 text-center"
                  >
                    <div className={`p-3 rounded-xl mb-4 inline-flex ${
                      item.color === 'cyan' ? 'bg-cyan-500/10' : 'bg-purple-500/10'
                    }`}>
                      <item.icon className={`w-6 h-6 ${
                        item.color === 'cyan' ? 'text-cyan-400' : 'text-purple-400'
                      }`} />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            className="text-center py-8"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Ready for the Challenge?
            </h2>
            <Link href="/play">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button size="lg" className="text-lg px-12 py-7 rounded-xl glow-purple">
                  <Brain className="w-5 h-5 mr-2" />
                  Start Now!
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Based on the classic Stroop Test (1935) for measuring cognitive interference
          </p>
        </div>
      </footer>
    </div>
  );
}
