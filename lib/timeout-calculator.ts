// Timeout tiers based on streak
// As streak increases, timeout decreases (game gets faster)

interface TimeoutConfig {
  timeoutMs: number;
  speedLevel: string;
}

const TIMEOUT_TIERS: { minStreak: number; config: TimeoutConfig }[] = [
  { minStreak: 30, config: { timeoutMs: 1000, speedLevel: '5x' } },
  { minStreak: 20, config: { timeoutMs: 1500, speedLevel: '3.3x' } },
  { minStreak: 15, config: { timeoutMs: 2000, speedLevel: '2.5x' } },
  { minStreak: 10, config: { timeoutMs: 3000, speedLevel: '1.67x' } },
  { minStreak: 5, config: { timeoutMs: 4000, speedLevel: '1.25x' } },
  { minStreak: 0, config: { timeoutMs: 5000, speedLevel: '1x' } },
];

/**
 * Get timeout configuration based on current streak
 * Higher streak = shorter timeout = faster gameplay
 */
export function getTimeoutConfig(streak: number): TimeoutConfig {
  for (const tier of TIMEOUT_TIERS) {
    if (streak >= tier.minStreak) {
      return tier.config;
    }
  }
  // Fallback (should never reach)
  return TIMEOUT_TIERS[TIMEOUT_TIERS.length - 1].config;
}

/**
 * Get the color class for timer based on time remaining percentage
 */
export function getTimerColorClass(timeRemaining: number, timeoutMs: number): string {
  const percentRemaining = (timeRemaining / timeoutMs) * 100;

  if (percentRemaining <= 20) {
    return 'text-red-400'; // Danger zone
  } else if (percentRemaining <= 50) {
    return 'text-yellow-400'; // Warning zone
  }
  return 'text-cyan-400'; // Safe zone
}
