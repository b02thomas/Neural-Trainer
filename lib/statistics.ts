import { RoundResult, SessionStatistics } from '@/types/game';

/**
 * Calculate comprehensive statistics from round results
 */
export function calculateSessionStats(rounds: RoundResult[]): SessionStatistics {
  if (rounds.length === 0) {
    return {
      totalRounds: 0,
      correctAnswers: 0,
      impulseErrors: 0,
      wrongChoices: 0,
      accuracyRate: 0,
      averageReactionTime: 0,
      fastestReactionTime: 0,
      slowestReactionTime: 0,
      longestStreak: 0,
    };
  }

  // Count outcomes
  const correctAnswers = rounds.filter((r) => r.outcome === 'success').length;
  const impulseErrors = rounds.filter((r) => r.outcome === 'impulse_error').length;
  const wrongChoices = rounds.filter((r) => r.outcome === 'wrong_choice').length;

  // Calculate accuracy
  const accuracyRate = (correctAnswers / rounds.length) * 100;

  // Calculate reaction times
  const reactionTimes = rounds.map((r) => r.reactionTimeMs);
  const averageReactionTime =
    reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;
  const fastestReactionTime = Math.min(...reactionTimes);
  const slowestReactionTime = Math.max(...reactionTimes);

  // Calculate longest streak
  let currentStreak = 0;
  let longestStreak = 0;

  rounds.forEach((round) => {
    if (round.outcome === 'success') {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  return {
    totalRounds: rounds.length,
    correctAnswers,
    impulseErrors,
    wrongChoices,
    accuracyRate,
    averageReactionTime,
    fastestReactionTime,
    slowestReactionTime,
    longestStreak,
  };
}

/**
 * Get reaction time distribution for charting
 */
export function getReactionTimeDistribution(rounds: RoundResult[]) {
  const buckets = {
    '<500ms': 0,
    '500-1000ms': 0,
    '1000-2000ms': 0,
    '>2000ms': 0,
  };

  rounds.forEach((round) => {
    const time = round.reactionTimeMs;
    if (time < 500) {
      buckets['<500ms']++;
    } else if (time < 1000) {
      buckets['500-1000ms']++;
    } else if (time < 2000) {
      buckets['1000-2000ms']++;
    } else {
      buckets['>2000ms']++;
    }
  });

  return Object.entries(buckets).map(([range, count]) => ({
    range,
    count,
  }));
}

/**
 * Get reaction time trend over rounds
 */
export function getReactionTimeTrend(rounds: RoundResult[]) {
  return rounds.map((round, index) => ({
    round: index + 1,
    time: round.reactionTimeMs,
    outcome: round.outcome,
  }));
}

/**
 * Get outcome distribution for pie chart
 */
export function getOutcomeDistribution(rounds: RoundResult[]) {
  const success = rounds.filter((r) => r.outcome === 'success').length;
  const impulseError = rounds.filter((r) => r.outcome === 'impulse_error').length;
  const wrongChoice = rounds.filter((r) => r.outcome === 'wrong_choice').length;

  return [
    { name: 'Correct', value: success, fill: '#22C55E' },
    { name: 'Impulse Error', value: impulseError, fill: '#EAB308' },
    { name: 'Wrong', value: wrongChoice, fill: '#EF4444' },
  ].filter((item) => item.value > 0);
}

/**
 * Calculate average reaction time per outcome type
 */
export function getAverageTimeByOutcome(rounds: RoundResult[]) {
  const successRounds = rounds.filter((r) => r.outcome === 'success');
  const impulseErrorRounds = rounds.filter((r) => r.outcome === 'impulse_error');
  const wrongChoiceRounds = rounds.filter((r) => r.outcome === 'wrong_choice');

  const avgSuccess =
    successRounds.length > 0
      ? successRounds.reduce((sum, r) => sum + r.reactionTimeMs, 0) / successRounds.length
      : 0;

  const avgImpulseError =
    impulseErrorRounds.length > 0
      ? impulseErrorRounds.reduce((sum, r) => sum + r.reactionTimeMs, 0) /
        impulseErrorRounds.length
      : 0;

  const avgWrongChoice =
    wrongChoiceRounds.length > 0
      ? wrongChoiceRounds.reduce((sum, r) => sum + r.reactionTimeMs, 0) /
        wrongChoiceRounds.length
      : 0;

  return [
    { outcome: 'Correct', avgTime: Math.round(avgSuccess) },
    { outcome: 'Impulse Error', avgTime: Math.round(avgImpulseError) },
    { outcome: 'Wrong', avgTime: Math.round(avgWrongChoice) },
  ].filter((item) => item.avgTime > 0);
}
