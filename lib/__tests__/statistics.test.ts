import { describe, it, expect } from 'vitest';
import {
  calculateSessionStats,
  getReactionTimeDistribution,
  getReactionTimeTrend,
  getOutcomeDistribution,
  getAverageTimeByOutcome,
} from '../statistics';
import { RoundResult, ColorName } from '@/types/game';

// Helper function to create mock round results
function createMockRound(
  outcome: 'success' | 'impulse_error' | 'wrong_choice',
  reactionTimeMs: number
): RoundResult {
  return {
    challenge: {
      id: crypto.randomUUID(),
      word: 'ROT' as ColorName,
      inkColor: 'BLAU' as ColorName,
      createdAt: Date.now(),
    },
    selectedColor: 'BLAU' as ColorName,
    outcome,
    reactionTimeMs,
    timestamp: Date.now(),
  };
}

describe('calculateSessionStats', () => {
  it('should return zeros for empty rounds array', () => {
    const stats = calculateSessionStats([]);

    expect(stats).toEqual({
      totalRounds: 0,
      correctAnswers: 0,
      impulseErrors: 0,
      wrongChoices: 0,
      accuracyRate: 0,
      averageReactionTime: 0,
      fastestReactionTime: 0,
      slowestReactionTime: 0,
      longestStreak: 0,
    });
  });

  it('should calculate correct statistics for all successful rounds', () => {
    const rounds = [
      createMockRound('success', 500),
      createMockRound('success', 600),
      createMockRound('success', 700),
    ];

    const stats = calculateSessionStats(rounds);

    expect(stats.totalRounds).toBe(3);
    expect(stats.correctAnswers).toBe(3);
    expect(stats.impulseErrors).toBe(0);
    expect(stats.wrongChoices).toBe(0);
    expect(stats.accuracyRate).toBe(100);
    expect(stats.averageReactionTime).toBe(600);
    expect(stats.fastestReactionTime).toBe(500);
    expect(stats.slowestReactionTime).toBe(700);
    expect(stats.longestStreak).toBe(3);
  });

  it('should calculate correct statistics for mixed outcomes', () => {
    const rounds = [
      createMockRound('success', 500),
      createMockRound('impulse_error', 450),
      createMockRound('wrong_choice', 550),
      createMockRound('success', 600),
      createMockRound('success', 700),
    ];

    const stats = calculateSessionStats(rounds);

    expect(stats.totalRounds).toBe(5);
    expect(stats.correctAnswers).toBe(3);
    expect(stats.impulseErrors).toBe(1);
    expect(stats.wrongChoices).toBe(1);
    expect(stats.accuracyRate).toBe(60); // 3/5 * 100
    expect(stats.averageReactionTime).toBe(560); // (500+450+550+600+700)/5
    expect(stats.fastestReactionTime).toBe(450);
    expect(stats.slowestReactionTime).toBe(700);
    expect(stats.longestStreak).toBe(2); // Last two successes
  });

  it('should calculate longest streak correctly across multiple streaks', () => {
    const rounds = [
      createMockRound('success', 500),
      createMockRound('success', 500),
      createMockRound('wrong_choice', 500),
      createMockRound('success', 500),
      createMockRound('success', 500),
      createMockRound('success', 500),
      createMockRound('impulse_error', 500),
      createMockRound('success', 500),
    ];

    const stats = calculateSessionStats(rounds);

    expect(stats.longestStreak).toBe(3); // Middle streak of 3
  });

  it('should handle single round', () => {
    const rounds = [createMockRound('success', 500)];
    const stats = calculateSessionStats(rounds);

    expect(stats.totalRounds).toBe(1);
    expect(stats.correctAnswers).toBe(1);
    expect(stats.accuracyRate).toBe(100);
    expect(stats.averageReactionTime).toBe(500);
    expect(stats.longestStreak).toBe(1);
  });
});

describe('getReactionTimeDistribution', () => {
  it('should return empty buckets for empty rounds', () => {
    const distribution = getReactionTimeDistribution([]);

    expect(distribution).toHaveLength(4);
    expect(distribution[0]).toEqual({ range: '<500ms', count: 0 });
    expect(distribution[1]).toEqual({ range: '500-1000ms', count: 0 });
    expect(distribution[2]).toEqual({ range: '1000-2000ms', count: 0 });
    expect(distribution[3]).toEqual({ range: '>2000ms', count: 0 });
  });

  it('should correctly bucket reaction times', () => {
    const rounds = [
      createMockRound('success', 300),   // <500ms
      createMockRound('success', 450),   // <500ms
      createMockRound('success', 600),   // 500-1000ms
      createMockRound('success', 900),   // 500-1000ms
      createMockRound('success', 1200),  // 1000-2000ms
      createMockRound('success', 2500),  // >2000ms
    ];

    const distribution = getReactionTimeDistribution(rounds);

    expect(distribution[0]).toEqual({ range: '<500ms', count: 2 });
    expect(distribution[1]).toEqual({ range: '500-1000ms', count: 2 });
    expect(distribution[2]).toEqual({ range: '1000-2000ms', count: 1 });
    expect(distribution[3]).toEqual({ range: '>2000ms', count: 1 });
  });

  it('should handle edge cases at bucket boundaries', () => {
    const rounds = [
      createMockRound('success', 499),   // <500ms
      createMockRound('success', 500),   // 500-1000ms
      createMockRound('success', 999),   // 500-1000ms
      createMockRound('success', 1000),  // 1000-2000ms
      createMockRound('success', 1999),  // 1000-2000ms
      createMockRound('success', 2000),  // >2000ms
    ];

    const distribution = getReactionTimeDistribution(rounds);

    expect(distribution[0]).toEqual({ range: '<500ms', count: 1 });
    expect(distribution[1]).toEqual({ range: '500-1000ms', count: 2 });
    expect(distribution[2]).toEqual({ range: '1000-2000ms', count: 2 });
    expect(distribution[3]).toEqual({ range: '>2000ms', count: 1 });
  });
});

describe('getReactionTimeTrend', () => {
  it('should return empty array for empty rounds', () => {
    const trend = getReactionTimeTrend([]);
    expect(trend).toEqual([]);
  });

  it('should map rounds to trend data with round numbers', () => {
    const rounds = [
      createMockRound('success', 500),
      createMockRound('impulse_error', 450),
      createMockRound('wrong_choice', 600),
    ];

    const trend = getReactionTimeTrend(rounds);

    expect(trend).toHaveLength(3);
    expect(trend[0]).toEqual({ round: 1, time: 500, outcome: 'success' });
    expect(trend[1]).toEqual({ round: 2, time: 450, outcome: 'impulse_error' });
    expect(trend[2]).toEqual({ round: 3, time: 600, outcome: 'wrong_choice' });
  });

  it('should preserve round order', () => {
    const rounds = Array.from({ length: 10 }, (_, i) =>
      createMockRound('success', (i + 1) * 100)
    );

    const trend = getReactionTimeTrend(rounds);

    expect(trend).toHaveLength(10);
    trend.forEach((item, index) => {
      expect(item.round).toBe(index + 1);
      expect(item.time).toBe((index + 1) * 100);
    });
  });
});

describe('getOutcomeDistribution', () => {
  it('should return empty array for empty rounds', () => {
    const distribution = getOutcomeDistribution([]);
    expect(distribution).toEqual([]);
  });

  it('should include only outcomes that occurred', () => {
    const rounds = [
      createMockRound('success', 500),
      createMockRound('success', 600),
    ];

    const distribution = getOutcomeDistribution(rounds);

    expect(distribution).toHaveLength(1);
    expect(distribution[0]).toEqual({
      name: 'Richtig',
      value: 2,
      fill: '#22C55E',
    });
  });

  it('should calculate all outcome types correctly', () => {
    const rounds = [
      createMockRound('success', 500),
      createMockRound('success', 500),
      createMockRound('success', 500),
      createMockRound('impulse_error', 500),
      createMockRound('impulse_error', 500),
      createMockRound('wrong_choice', 500),
    ];

    const distribution = getOutcomeDistribution(rounds);

    expect(distribution).toHaveLength(3);
    expect(distribution).toContainEqual({
      name: 'Richtig',
      value: 3,
      fill: '#22C55E',
    });
    expect(distribution).toContainEqual({
      name: 'Impuls-Fehler',
      value: 2,
      fill: '#EAB308',
    });
    expect(distribution).toContainEqual({
      name: 'Falsch',
      value: 1,
      fill: '#EF4444',
    });
  });

  it('should have correct colors for each outcome', () => {
    const rounds = [
      createMockRound('success', 500),
      createMockRound('impulse_error', 500),
      createMockRound('wrong_choice', 500),
    ];

    const distribution = getOutcomeDistribution(rounds);

    const successItem = distribution.find(d => d.name === 'Richtig');
    const impulseItem = distribution.find(d => d.name === 'Impuls-Fehler');
    const wrongItem = distribution.find(d => d.name === 'Falsch');

    expect(successItem?.fill).toBe('#22C55E'); // green
    expect(impulseItem?.fill).toBe('#EAB308'); // yellow
    expect(wrongItem?.fill).toBe('#EF4444');   // red
  });
});

describe('getAverageTimeByOutcome', () => {
  it('should return empty array for empty rounds', () => {
    const avgTimes = getAverageTimeByOutcome([]);
    expect(avgTimes).toEqual([]);
  });

  it('should calculate average time for each outcome type', () => {
    const rounds = [
      createMockRound('success', 500),
      createMockRound('success', 600),
      createMockRound('impulse_error', 400),
      createMockRound('impulse_error', 500),
      createMockRound('wrong_choice', 800),
    ];

    const avgTimes = getAverageTimeByOutcome(rounds);

    expect(avgTimes).toHaveLength(3);
    expect(avgTimes).toContainEqual({
      outcome: 'Richtig',
      avgTime: 550, // (500+600)/2
    });
    expect(avgTimes).toContainEqual({
      outcome: 'Impuls-Fehler',
      avgTime: 450, // (400+500)/2
    });
    expect(avgTimes).toContainEqual({
      outcome: 'Falsch',
      avgTime: 800,
    });
  });

  it('should only include outcomes that occurred', () => {
    const rounds = [
      createMockRound('success', 500),
      createMockRound('success', 600),
    ];

    const avgTimes = getAverageTimeByOutcome(rounds);

    expect(avgTimes).toHaveLength(1);
    expect(avgTimes[0]).toEqual({
      outcome: 'Richtig',
      avgTime: 550,
    });
  });

  it('should round average times to whole numbers', () => {
    const rounds = [
      createMockRound('success', 500),
      createMockRound('success', 501),
    ];

    const avgTimes = getAverageTimeByOutcome(rounds);

    expect(avgTimes[0].avgTime).toBe(501); // rounds 500.5 to 501
    expect(Number.isInteger(avgTimes[0].avgTime)).toBe(true);
  });

  it('should handle single round per outcome', () => {
    const rounds = [
      createMockRound('success', 500),
    ];

    const avgTimes = getAverageTimeByOutcome(rounds);

    expect(avgTimes).toHaveLength(1);
    expect(avgTimes[0]).toEqual({
      outcome: 'Richtig',
      avgTime: 500,
    });
  });
});
