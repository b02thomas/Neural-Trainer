'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dumbbell,
  Coffee,
  BookOpen,
  Music,
  Footprints,
  Wind,
  Eye,
  MessageCircle,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string;
}

const ACTIVITIES: Activity[] = [
  { id: 'stretch', icon: Dumbbell, label: 'Stretch', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  { id: 'hydrate', icon: Coffee, label: 'Get water or tea', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { id: 'read', icon: BookOpen, label: 'Read something', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  { id: 'music', icon: Music, label: 'Listen to music', color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
  { id: 'walk', icon: Footprints, label: 'Take a walk', color: 'text-green-400', bgColor: 'bg-green-500/10' },
  { id: 'breathe', icon: Wind, label: 'Deep breathing', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
  { id: 'eyes', icon: Eye, label: 'Rest your eyes', color: 'text-indigo-400', bgColor: 'bg-indigo-500/10' },
  { id: 'chat', icon: MessageCircle, label: 'Talk to someone', color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
];

function selectRandomActivities(count: number = 4): Activity[] {
  const shuffled = [...ACTIVITIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface CooldownActivitiesProps {
  className?: string;
}

export function CooldownActivities({ className }: CooldownActivitiesProps) {
  const [activities, setActivities] = useState(() => selectRandomActivities(4));

  const handleShuffle = () => {
    setActivities(selectRandomActivities(4));
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Suggested Activities</h3>
        <button
          onClick={handleShuffle}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Shuffle
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg',
                  activity.bgColor
                )}
              >
                <Icon className={cn('w-5 h-5', activity.color)} />
                <span className="text-sm">{activity.label}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
