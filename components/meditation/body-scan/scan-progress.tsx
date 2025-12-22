'use client';

import { motion } from 'motion/react';
import { BODY_REGIONS, BODY_REGION_CONFIGS } from '@/types/meditation';

interface ScanProgressProps {
  currentRegionIndex: number;
  regionProgress: number;
}

const ACTIVE_COLOR = '#A855F7';
const COMPLETED_COLOR = '#22D3EE';

export function ScanProgress({ currentRegionIndex, regionProgress }: ScanProgressProps) {
  const totalRegions = BODY_REGIONS.length;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      {/* Segmented progress bar */}
      <div className="flex gap-1">
        {BODY_REGIONS.map((region, index) => {
          const isCompleted = index < currentRegionIndex;
          const isActive = index === currentRegionIndex;
          const isFuture = index > currentRegionIndex;

          return (
            <div key={region} className="flex-1 relative group">
              {/* Segment background */}
              <div
                className="h-2 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: isCompleted
                    ? COMPLETED_COLOR
                    : isFuture
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Active segment fill */}
                {isActive && (
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: ACTIVE_COLOR }}
                    initial={{ width: 0 }}
                    animate={{ width: `${regionProgress * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                )}
              </div>

              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-background/90 backdrop-blur-sm border border-white/10 rounded px-2 py-1 text-xs whitespace-nowrap">
                  {BODY_REGION_CONFIGS[region].nameDe}
                </div>
              </div>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderBottom: `4px solid ${ACTIVE_COLOR}`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Füße</span>
        <span className="text-purple-400 font-medium">
          {currentRegionIndex + 1} / {totalRegions}
        </span>
        <span>Kopf</span>
      </div>
    </div>
  );
}
