'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  span?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
}

export function BentoCard({ children, className, span = 1, rowSpan = 1 }: BentoCardProps) {
  const colSpanClasses = {
    1: '',
    2: 'md:col-span-2',
    3: 'md:col-span-2 lg:col-span-3',
  };

  const rowSpanClasses = {
    1: '',
    2: 'row-span-2',
  };

  return (
    <div
      className={cn(
        'bento-card p-6',
        colSpanClasses[span],
        rowSpanClasses[rowSpan],
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoMetricProps {
  label: string;
  value: string | number;
  suffix?: string;
  color?: 'default' | 'purple' | 'cyan' | 'green' | 'yellow' | 'orange';
  icon?: ReactNode;
  subtext?: string;
}

export function BentoMetric({
  label,
  value,
  suffix,
  color = 'default',
  icon,
  subtext,
}: BentoMetricProps) {
  const colorClasses = {
    default: 'text-foreground',
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    orange: 'text-orange-400',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <span className="text-muted-foreground">{icon}</span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn('text-4xl font-ultra-bold', colorClasses[color])}>
          {value}
        </span>
        {suffix && (
          <span className="text-lg text-muted-foreground font-mono">{suffix}</span>
        )}
      </div>
      {subtext && (
        <p className="text-xs text-muted-foreground">{subtext}</p>
      )}
    </div>
  );
}
