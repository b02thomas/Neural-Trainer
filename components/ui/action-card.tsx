'use client';

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  iconColor?: 'purple' | 'cyan' | 'default';
}

export function ActionCard({
  icon: Icon,
  title,
  description,
  href,
  onClick,
  className,
  iconColor = 'purple',
}: ActionCardProps) {
  const iconColorClasses = {
    purple: 'text-purple-400 group-hover:text-purple-300',
    cyan: 'text-cyan-400 group-hover:text-cyan-300',
    default: 'text-foreground',
  };

  const content = (
    <motion.div
      className={cn(
        'action-card group flex items-center gap-4 p-5',
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={cn(
          'flex-shrink-0 p-3 rounded-xl bg-white/5 transition-all duration-300',
          'group-hover:bg-white/10 group-hover:shadow-lg',
          iconColor === 'purple' && 'group-hover:shadow-purple-500/20',
          iconColor === 'cyan' && 'group-hover:shadow-cyan-500/20'
        )}
        style={{
          transform: 'perspective(500px) rotateY(-5deg)',
        }}
      >
        <Icon
          className={cn(
            'w-6 h-6 transition-colors duration-300',
            iconColorClasses[iconColor]
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground group-hover:text-white transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-5 h-5 text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  if (onClick) {
    return <button onClick={onClick} className="w-full text-left">{content}</button>;
  }

  return content;
}

interface ActionCardsRowProps {
  children: React.ReactNode;
  className?: string;
}

export function ActionCardsRow({ children, className }: ActionCardsRowProps) {
  return (
    <motion.div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
        className
      )}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
