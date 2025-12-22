'use client';

import { motion } from 'motion/react';
import { BodyRegion, BODY_REGIONS } from '@/types/meditation';

interface BodySilhouetteProps {
  activeRegion: BodyRegion;
  completedRegions: number;
  size?: number;
}

// SVG path definitions for each body region
// Coordinates based on a 200x400 viewBox (frontal standing figure)
const REGION_PATHS: Record<BodyRegion, string> = {
  // Lower body
  'feet': 'M75,380 L80,395 L85,400 L95,400 L100,395 L100,380 L90,375 L85,375 Z M100,380 L105,395 L110,400 L120,400 L125,395 L120,380 L110,375 L105,375 Z',
  'lower-legs': 'M78,320 L75,380 L100,380 L95,320 Z M105,320 L100,380 L125,380 L122,320 Z',
  'upper-legs': 'M80,240 L78,320 L95,320 L92,240 Z M108,240 L105,320 L122,320 L120,240 Z',
  'pelvis': 'M75,200 L70,240 L130,240 L125,200 Z',

  // Torso
  'abdomen': 'M70,160 L68,200 L132,200 L130,160 Z',
  'chest': 'M65,115 L65,160 L135,160 L135,115 Z',
  'lower-back': 'M68,170 Q100,185 132,170 L132,200 Q100,190 68,200 Z',
  'upper-back': 'M65,115 Q100,130 135,115 L135,155 Q100,145 65,155 Z',

  // Arms
  'hands': 'M35,260 L30,280 L35,285 L45,285 L50,275 L48,260 Z M165,260 L162,280 L165,285 L175,285 L180,275 L175,260 Z',
  'forearms': 'M48,200 L35,260 L50,260 L55,200 Z M145,200 L150,260 L165,260 L155,200 Z',
  'upper-arms': 'M55,130 L48,200 L62,200 L65,130 Z M135,130 L138,200 L152,200 L145,130 Z',
  'shoulders': 'M55,105 L45,130 L65,130 L65,105 Z M135,105 L155,130 L135,130 L135,105 Z',

  // Head and neck
  'neck': 'M88,85 L85,105 L115,105 L112,85 Z',
  'face': 'M82,45 L80,75 L85,85 L115,85 L120,75 L118,45 Z',
  'head': 'M80,20 L75,45 L82,45 L80,35 Q100,25 120,35 L118,45 L125,45 L120,20 Q100,10 80,20 Z',
};

// Active color (purple to match the hub card)
const ACTIVE_COLOR = '#A855F7';
const COMPLETED_COLOR = '#22D3EE';
const INACTIVE_COLOR = '#334155';

export function BodySilhouette({ activeRegion, completedRegions, size = 300 }: BodySilhouetteProps) {
  const activeIndex = BODY_REGIONS.indexOf(activeRegion);

  // Calculate scale to fit the viewBox (200x400) into the desired size
  const scale = size / 400;
  const width = 200 * scale;
  const height = size;

  const getRegionStyle = (region: BodyRegion, index: number) => {
    const isActive = region === activeRegion;
    const isCompleted = index < completedRegions;

    if (isActive) {
      return {
        fill: `${ACTIVE_COLOR}60`,
        stroke: ACTIVE_COLOR,
        strokeWidth: 2,
        filter: `drop-shadow(0 0 12px ${ACTIVE_COLOR}80)`,
      };
    }

    if (isCompleted) {
      return {
        fill: `${COMPLETED_COLOR}30`,
        stroke: COMPLETED_COLOR,
        strokeWidth: 1,
      };
    }

    return {
      fill: `${INACTIVE_COLOR}30`,
      stroke: INACTIVE_COLOR,
      strokeWidth: 0.5,
    };
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 400"
        className="overflow-visible"
      >
        {/* Background silhouette outline */}
        <motion.path
          d="M100,10
             Q130,10 130,40
             L130,45
             Q140,50 145,70
             L160,130
             Q165,140 160,150
             L140,220
             Q135,240 140,260
             L150,290
             L145,305
             Q140,310 135,305
             L120,275
             L115,320
             L120,380
             L115,400
             L85,400
             L80,380
             L85,320
             L80,275
             L65,305
             Q60,310 55,305
             L50,290
             L60,260
             Q65,240 60,220
             L40,150
             Q35,140 40,130
             L55,70
             Q60,50 70,45
             L70,40
             Q70,10 100,10 Z"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Body region paths */}
        {BODY_REGIONS.map((region, index) => {
          const style = getRegionStyle(region, index);
          const isActive = region === activeRegion;

          return (
            <motion.path
              key={region}
              d={REGION_PATHS[region]}
              fill={style.fill}
              stroke={style.stroke}
              strokeWidth={style.strokeWidth}
              style={{ filter: style.filter }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                scale: isActive ? 1.02 : 1,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.03,
              }}
            />
          );
        })}

        {/* Active region pulse effect */}
        {activeRegion && (
          <motion.path
            d={REGION_PATHS[activeRegion]}
            fill="none"
            stroke={ACTIVE_COLOR}
            strokeWidth={3}
            initial={{ opacity: 0.8 }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.05, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            style={{
              filter: `drop-shadow(0 0 20px ${ACTIVE_COLOR})`,
              transformOrigin: 'center',
            }}
          />
        )}
      </svg>

      {/* Glow effect behind active region */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
        style={{
          width: size * 0.3,
          height: size * 0.3,
          top: `${(activeIndex / 15) * 70 + 10}%`,
          background: `radial-gradient(circle, ${ACTIVE_COLOR}40, transparent)`,
        }}
      />
    </div>
  );
}
