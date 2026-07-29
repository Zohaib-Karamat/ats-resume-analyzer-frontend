import { useMemo, useState, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";

function ChartWrapper({ children }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    
    // Initial measurement
    setWidth(ref.current.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full h-[300px]">
      {width > 0 && children(width)}
    </div>
  );
}

export function ScoreTrendChart({ analyses }) {
  const data = useMemo(() => {
    if (!analyses || analyses.length === 0) return [];
    return analyses.map((a, i) => ({
      id: `Analysis ${i + 1}`, // Unique identifier for XAxis so same-day analyses don't overlap
      date: new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: a.score,
      name: a.resumeName,
    }));
  }, [analyses]);

  if (!data.length) {
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Score Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartWrapper>
          {(width) => (
            <AreaChart width={width} height={300} data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
              <XAxis dataKey="id" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} domain={[0, 100]} />
              <Tooltip
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return `${label} (${payload[0].payload.date})`;
                  }
                  return label;
                }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#18181b', fontWeight: 600 }}
                labelStyle={{ color: '#71717a', fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#4f46e5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorScore)"
                activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                animationDuration={1500}
              />
            </AreaChart>
          )}
        </ChartWrapper>
      </CardContent>
    </Card>
  );
}

export function ScoreDistributionChart({ analyses }) {
  const data = useMemo(() => {
    if (!analyses || analyses.length === 0) return [];
    const distribution = { Good: 0, Average: 0, Poor: 0 };
    analyses.forEach((a) => {
      if (a.score >= 80) distribution.Good += 1;
      else if (a.score >= 60) distribution.Average += 1;
      else distribution.Poor += 1;
    });
    return [
      { name: "Excellent (80-100)", value: distribution.Good, color: "#10b981" },
      { name: "Good (60-79)", value: distribution.Average, color: "#f59e0b" },
      { name: "Needs Work (<60)", value: distribution.Poor, color: "#ef4444" },
    ].filter((d) => d.value > 0);
  }, [analyses]);

  if (!data.length) {
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Score Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartWrapper>
          {(width) => (
            <PieChart width={width} height={300}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          )}
        </ChartWrapper>
      </CardContent>
    </Card>
  );
}
