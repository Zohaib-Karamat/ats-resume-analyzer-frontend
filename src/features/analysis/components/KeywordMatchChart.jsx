import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useTheme } from "../../../contexts/ThemeContext";

export function KeywordMatchChart({ data = [] }) {
  const { isDark } = useTheme();

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-4 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
        No keyword category scores were returned for this analysis.
      </div>
    );
  }

  const getColor = (s) => {
    if (s >= 80) return isDark ? "#34d399" : "#10b981"; // emerald
    if (s >= 60) return isDark ? "#fbbf24" : "#f59e0b"; // amber
    return isDark ? "#fb7185" : "#f43f5e"; // rose
  };

  const gridColor = isDark ? "#27272a" : "#f4f4f5";
  const textColor = isDark ? "#a1a1aa" : "#71717a";
  const tooltipBg = isDark ? "#18181b" : "#ffffff";
  const tooltipBorder = isDark ? "#27272a" : "#e4e4e7";

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 12 }}
            domain={[0, 100]}
          />
          <Tooltip 
            cursor={{ fill: isDark ? "#27272a" : "#f4f4f5" }}
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              borderColor: tooltipBorder,
              borderRadius: "8px",
              color: isDark ? "#f4f4f5" : "#18181b"
            }}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]} animationDuration={1500}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
