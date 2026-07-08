import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { useTheme } from "../../../contexts/ThemeContext";

export function ScoreGauge({ score }) {
  const { isDark } = useTheme();

  // Map score to color based on semantic rules
  const getColor = (s) => {
    if (s >= 80) return isDark ? "#34d399" : "#10b981"; // emerald-400 : emerald-500
    if (s >= 60) return isDark ? "#fbbf24" : "#f59e0b"; // amber-400 : amber-500
    return isDark ? "#fb7185" : "#f43f5e"; // rose-400 : rose-500
  };

  const data = [
    { name: "Score", value: score, fill: getColor(score) }
  ];

  const trackColor = isDark ? "#27272a" : "#f4f4f5"; // zinc-800 : zinc-100

  return (
    <div className="relative flex h-52 w-full flex-col items-center justify-center">
      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="70%" 
            outerRadius="100%" 
            barSize={16} 
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis 
              type="number" 
              domain={[0, 100]} 
              angleAxisId={0} 
              tick={false} 
            />
            {/* Background Track */}
            <RadialBar
              background={{ fill: trackColor }}
              dataKey="value"
              cornerRadius={8}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Center Text */}
      <div className="z-10 flex flex-col items-center">
        <span className="text-4xl font-bold tracking-tight text-zinc-950 text-number dark:text-zinc-50">
          {score}
        </span>
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          ATS Match
        </span>
      </div>
    </div>
  );
}
