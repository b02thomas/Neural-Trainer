'use client';

import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface MiniChartProps {
  data: Array<{ value: number; [key: string]: unknown }>;
  dataKey?: string;
  className?: string;
  height?: number;
  showTooltip?: boolean;
  color?: 'purple' | 'cyan' | 'gradient';
}

export function MiniChart({
  data,
  dataKey = 'value',
  className,
  height = 60,
  showTooltip = true,
  color = 'gradient',
}: MiniChartProps) {
  const strokeColor = {
    purple: '#a855f7',
    cyan: '#06b6d4',
    gradient: 'url(#miniChartGradient)',
  };

  if (!data || data.length === 0) {
    return (
      <div
        className={cn('flex items-center justify-center text-muted-foreground text-sm', className)}
        style={{ height }}
      >
        No data
      </div>
    );
  }

  return (
    <div className={cn('mini-chart-glow', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="miniChartGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {showTooltip && (
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="neural-toast px-3 py-2 text-sm">
                      <span className="font-mono text-cyan-400">
                        {payload[0].value}
                      </span>
                    </div>
                  );
                }
                return null;
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={strokeColor[color]}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: '#a855f7',
              stroke: '#06b6d4',
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface SparklineProps {
  values: number[];
  className?: string;
  height?: number;
}

export function Sparkline({ values, className, height = 40 }: SparklineProps) {
  const data = values.map((value, index) => ({ value, index }));
  return <MiniChart data={data} className={className} height={height} showTooltip={false} />;
}
