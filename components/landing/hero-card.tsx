'use client';

import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface HeroCardProps {
  children: ReactNode;
  className?: string;
}

export function HeroCard({ children, className }: HeroCardProps) {
  return (
    <motion.div
      className={cn('hero-card p-8 md:p-12', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

interface HeroTitleProps {
  children: ReactNode;
  className?: string;
}

export function HeroTitle({ children, className }: HeroTitleProps) {
  return (
    <h1
      className={cn(
        'text-4xl md:text-6xl lg:text-7xl font-ultra-bold tracking-tight',
        className
      )}
    >
      {children}
    </h1>
  );
}

interface HeroSubtitleProps {
  children: ReactNode;
  className?: string;
}

export function HeroSubtitle({ children, className }: HeroSubtitleProps) {
  return (
    <p
      className={cn(
        'text-lg md:text-xl text-muted-foreground max-w-2xl',
        className
      )}
    >
      {children}
    </p>
  );
}

interface HeroGradientTextProps {
  children: ReactNode;
  className?: string;
}

export function HeroGradientText({ children, className }: HeroGradientTextProps) {
  return (
    <span className={cn('text-gradient-purple-cyan', className)}>
      {children}
    </span>
  );
}
