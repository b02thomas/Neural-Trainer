'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Activity, Brain, Zap, Target } from 'lucide-react';

const ACTIVITY_MESSAGES = [
  { icon: Brain, text: 'Neural pathway activated', color: 'text-purple-400' },
  { icon: Zap, text: 'Synapse firing detected', color: 'text-cyan-400' },
  { icon: Target, text: 'Focus lock engaged', color: 'text-green-400' },
  { icon: Activity, text: 'Cognitive load optimized', color: 'text-yellow-400' },
  { icon: Brain, text: 'Pattern recognition online', color: 'text-purple-400' },
  { icon: Zap, text: 'Response calibration active', color: 'text-cyan-400' },
];

interface ActivityFeedProps {
  className?: string;
  maxItems?: number;
  interval?: number;
}

export function ActivityFeed({
  className,
  maxItems = 3,
  interval = 2500
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<typeof ACTIVITY_MESSAGES>([]);

  useEffect(() => {
    // Initial activity
    setActivities([ACTIVITY_MESSAGES[0]]);

    const timer = setInterval(() => {
      setActivities((prev) => {
        const availableMessages = ACTIVITY_MESSAGES.filter(
          (msg) => !prev.includes(msg)
        );
        const newMessage =
          availableMessages[Math.floor(Math.random() * availableMessages.length)] ||
          ACTIVITY_MESSAGES[Math.floor(Math.random() * ACTIVITY_MESSAGES.length)];

        const updated = [newMessage, ...prev];
        return updated.slice(0, maxItems);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [maxItems, interval]);

  return (
    <div className={cn('activity-feed p-3', className)}>
      <div className="flex items-center gap-2 mb-2 px-2">
        <div className="w-2 h-2 rounded-full bg-cyan-400 status-indicator" />
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          Live Activity
        </span>
      </div>
      {/* Fixed height container to prevent resizing */}
      <div className="relative overflow-hidden" style={{ height: `${maxItems * 32}px` }}>
        <AnimatePresence mode="popLayout">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={`${activity.text}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 px-2 py-1.5 mb-1 rounded bg-white/5"
              >
                <Icon className={cn('w-3 h-3 flex-shrink-0', activity.color)} />
                <span className="text-xs text-muted-foreground truncate">
                  {activity.text}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {/* Fade overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
