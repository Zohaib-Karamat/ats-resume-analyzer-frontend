import { useDashboardStats } from "../hooks/useDashboardStats";
import { StatCard } from "../components/StatCard";
import { RecentAnalysesList } from "../components/RecentAnalysesList";

import { FileText, Briefcase, Activity, Target } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";

export function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useDashboardStats();

  // Extract stats with default fallbacks
  const stats = data?.stats || {
    resumeCount: 0,
    jdCount: 0,
    analysisCount: 0,
    averageScore: 0,
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
          Welcome back, {user?.name?.split(' ')[0] || "User"}
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Here's an overview of your resume targeting performance.
        </p>
      </div>

      {isError && (
        <div className="rounded-md bg-rose-50 p-4 dark:bg-rose-900/30">
          <p className="text-sm text-rose-700 dark:text-rose-400">
            Failed to load dashboard data. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Stats Grid - 1 col mobile, 2 col tablet, 4 col desktop */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Resumes Uploaded"
          value={stats.resumeCount}
          icon={FileText}
        />
        <StatCard
          title="Job Descriptions"
          value={stats.jdCount}
          icon={Briefcase}
        />
        <StatCard
          title="Total Analyses"
          value={stats.analysisCount}
          icon={Activity}
        />
        <StatCard
          title="Average Match Score"
          value={stats.averageScore}
          icon={Target}
          isPercent
        />
      </div>


      {/* Main Content Area Row 2 */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentAnalysesList
            analyses={data?.recentAnalyses}
            isLoading={isLoading}
          />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-1">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Quick Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Tailoring your resume to specific job descriptions increases your chances of getting an interview by 40%.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
