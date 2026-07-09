import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Skeleton } from "../../../components/ui/Skeleton";
import { Link } from "react-router-dom";

function formatRelativeTime(dateString) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diffInDays = Math.round((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
  return rtf.format(diffInDays, 'day');
}

function getScoreColor(score) {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "danger";
}

export function RecentAnalysesList({ analyses, isLoading }) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recent Analyses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between space-x-4 border-b border-zinc-100 pb-4 last:border-0 last:pb-0 dark:border-zinc-800">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Analyses</CardTitle>
      </CardHeader>
      <CardContent>
        {analyses && analyses.length > 0 ? (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div 
                key={analysis.id} 
                className="flex items-start justify-between gap-3 border-b border-zinc-100 pb-4 last:border-0 last:pb-0 dark:border-zinc-800"
              >
                <div className="flex min-w-0 flex-col">
                  <Link 
                    to={`/analysis/${analysis.id}`}
                    className="truncate text-sm font-medium text-zinc-950 hover:underline dark:text-zinc-50"
                  >
                    {analysis.resumeName}
                  </Link>
                  <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {analysis.jobTitle} • {formatRelativeTime(analysis.date)}
                  </span>
                </div>
                <Badge variant={getScoreColor(analysis.score)}>
                  {analysis.score}%
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No analyses performed yet.
            </p>
            <Link 
              to="/analysis" 
              className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Start a new analysis
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
