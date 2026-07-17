import { useEffect, useState } from "react";
import { Card, CardContent } from "../../../components/ui/Card";

function useCountUp(end, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < duration) {
        // ease out cubic
        const p = progress / duration;
        const easeOut = 1 - Math.pow(1 - p, 3);
        setCount(end * easeOut);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

export function StatCard({ title, value, icon: Icon, isPercent = false }) {
  const count = useCountUp(value);
  const displayValue = isPercent
    ? count.toFixed(1) + "%"
    : Math.floor(count).toLocaleString();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {title}
            </p>
            <p className="mt-2 text-3xl font-bold text-zinc-950 text-number dark:text-zinc-50">
              {displayValue}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

