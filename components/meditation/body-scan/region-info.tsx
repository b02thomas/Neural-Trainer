'use client';

import { motion, AnimatePresence } from 'motion/react';
import { BodyRegion, BODY_REGIONS, BODY_REGION_CONFIGS } from '@/types/meditation';

interface RegionInfoProps {
  currentRegion: BodyRegion;
  regionProgress: number;
  completedRegions: number;
}

const ACTIVE_COLOR = '#A855F7';

export function RegionInfo({ currentRegion, regionProgress, completedRegions }: RegionInfoProps) {
  const config = BODY_REGION_CONFIGS[currentRegion];
  const regionIndex = BODY_REGIONS.indexOf(currentRegion);
  const totalRegions = BODY_REGIONS.length;

  return (
    <div className="text-center space-y-6">
      {/* Region counter */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>Region</span>
        <span className="text-purple-400 font-bold">{regionIndex + 1}</span>
        <span>von</span>
        <span>{totalRegions}</span>
      </div>

      {/* Region name with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRegion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: ACTIVE_COLOR }}
          >
            {config.nameDe}
          </h2>

          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            {config.promptDe}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-xs mx-auto">
        {BODY_REGIONS.map((region, index) => {
          const isCompleted = index < completedRegions;
          const isActive = index === regionIndex;
          const isCurrent = region === currentRegion;

          return (
            <motion.div
              key={region}
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.02 }}
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-cyan-400'
                    : isActive
                    ? 'bg-purple-500'
                    : 'bg-white/10'
                }`}
                style={{
                  boxShadow: isActive
                    ? `0 0 10px ${ACTIVE_COLOR}`
                    : isCompleted
                    ? '0 0 6px rgba(34, 211, 238, 0.5)'
                    : 'none',
                }}
              />

              {/* Active indicator pulse */}
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-purple-500"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Region progress bar */}
      <div className="w-full max-w-xs mx-auto">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: ACTIVE_COLOR }}
            initial={{ width: 0 }}
            animate={{ width: `${regionProgress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </div>
  );
}
