'use client';

import { RoundResult } from '@/types/game';
import {
  calculateSessionStats,
  getReactionTimeTrend,
  getOutcomeDistribution,
  getAverageTimeByOutcome,
} from '@/lib/statistics';
import { BentoGrid, BentoCard, BentoMetric } from '@/components/ui/bento-grid';
import { MiniChart } from '@/components/ui/mini-chart';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Trophy, Target, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsDashboardProps {
  rounds: RoundResult[];
}

export function StatsDashboard({ rounds }: StatsDashboardProps) {
  if (rounds.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No data available. Play a few rounds first!
        </p>
      </div>
    );
  }

  const stats = calculateSessionStats(rounds);
  const reactionTrend = getReactionTimeTrend(rounds);
  const outcomeDistribution = getOutcomeDistribution(rounds);
  const avgTimeByOutcome = getAverageTimeByOutcome(rounds);

  // Prepare mini chart data
  const reactionMiniData = reactionTrend.slice(-20).map((item) => ({
    value: item.time,
  }));

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Key Metrics - Bento Grid */}
      <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <BentoCard>
          <BentoMetric
            label="Accuracy"
            value={stats.accuracyRate.toFixed(1)}
            suffix="%"
            color="green"
            icon={<Target className="w-4 h-4" />}
            subtext={`${stats.correctAnswers} of ${stats.totalRounds} correct`}
          />
        </BentoCard>

        <BentoCard>
          <BentoMetric
            label="Avg Reaction"
            value={Math.round(stats.averageReactionTime)}
            suffix="ms"
            color="cyan"
            icon={<Zap className="w-4 h-4" />}
            subtext={`Fastest: ${Math.round(stats.fastestReactionTime)}ms`}
          />
          <div className="mt-4">
            <MiniChart data={reactionMiniData} height={50} />
          </div>
        </BentoCard>

        <BentoCard>
          <BentoMetric
            label="Best Streak"
            value={stats.longestStreak}
            color="yellow"
            icon={<Trophy className="w-4 h-4" />}
            subtext="Consecutive correct answers"
          />
        </BentoCard>

        <BentoCard>
          <BentoMetric
            label="Impulse Errors"
            value={stats.impulseErrors}
            color="orange"
            icon={<TrendingUp className="w-4 h-4" />}
            subtext={`${((stats.impulseErrors / stats.totalRounds) * 100).toFixed(1)}% of all rounds`}
          />
        </BentoCard>
      </BentoGrid>

      {/* Charts Row */}
      <BentoGrid className="grid-cols-1 lg:grid-cols-2">
        {/* Reaction Time Trend */}
        <BentoCard span={1}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Reaction Time Over Time</h3>
            <p className="text-sm text-muted-foreground">
              Your reaction time across all {rounds.length} rounds
            </p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={reactionTrend}>
              <defs>
                <linearGradient id="reactionGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="round"
                stroke="rgba(255,255,255,0.3)"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.3)"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="neural-toast px-3 py-2">
                        <p className="font-semibold text-foreground">Round {data.round}</p>
                        <p className="text-sm font-mono text-cyan-400">{data.time}ms</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {data.outcome === 'success'
                            ? 'Correct'
                            : data.outcome === 'impulse_error'
                            ? 'Impulse Error'
                            : 'Wrong'}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="time"
                stroke="url(#reactionGradient)"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  const color =
                    payload.outcome === 'success'
                      ? '#22C55E'
                      : payload.outcome === 'impulse_error'
                      ? '#EAB308'
                      : '#EF4444';
                  return <circle cx={cx} cy={cy} r={4} fill={color} />;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </BentoCard>

        {/* Outcome Distribution */}
        <BentoCard span={1}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Answer Distribution</h3>
            <p className="text-sm text-muted-foreground">
              How often you answered correctly, incorrectly, or impulsively
            </p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={outcomeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
                stroke="rgba(0,0,0,0.3)"
                strokeWidth={2}
              >
                {outcomeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="neural-toast px-3 py-2">
                        <p className="font-semibold text-foreground">{payload[0].name}</p>
                        <p className="text-sm font-mono text-cyan-400">{payload[0].value} rounds</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </BentoCard>
      </BentoGrid>

      {/* Average Time by Outcome */}
      {avgTimeByOutcome.length > 0 && (
        <BentoGrid>
          <BentoCard span={3}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Reaction Time by Answer Type</h3>
              <p className="text-sm text-muted-foreground">
                Comparison of average reaction time by answer type
              </p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={avgTimeByOutcome}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="outcome"
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="neural-toast px-3 py-2">
                          <p className="font-semibold text-foreground">{payload[0].payload.outcome}</p>
                          <p className="text-sm font-mono text-cyan-400">{Math.round(payload[0].value as number)}ms avg</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="avgTime" radius={[4, 4, 0, 0]}>
                  {avgTimeByOutcome.map((entry, index) => {
                    const color =
                      entry.outcome === 'Correct'
                        ? '#22C55E'
                        : entry.outcome === 'Impulse Error'
                        ? '#EAB308'
                        : '#EF4444';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </BentoCard>
        </BentoGrid>
      )}
    </motion.div>
  );
}
