import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAnalysis } from "../hooks/useAnalysis";
import { ScoreGauge } from "../components/ScoreGauge";
import { SkillChip } from "../components/SkillChip";
import { StrengthsWeaknesses } from "../components/StrengthsWeaknesses";
import { SuggestionsAccordion } from "../components/SuggestionsAccordion";
import { AISummaryCard } from "../components/AISummaryCard";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";
import { QueryErrorState } from "../../../components/ui/States";

function MetricCard({ label, value }) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col justify-center p-5">
        <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
        <p className="mt-2 text-2xl font-bold text-zinc-950 dark:text-zinc-50">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function SkillSection({ title, count, variant, skills, emptyMessage }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
      <h4
        className={
          variant === "matched"
            ? "mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
            : "mb-3 text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400"
        }
      >
        {title} ({count})
      </h4>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <SkillChip key={skill} skill={skill} variant={variant} />
          ))
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {emptyMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export function AnalysisResultPage() {
  const { id } = useParams();
  const { data: analysis, isLoading, isError, refetch } = useAnalysis(id);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 h-full flex flex-col p-4">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <QueryErrorState
        onRetry={refetch}
        message="We could not load this analysis from the server."
        className="mx-auto mt-12 max-w-2xl"
      />
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-zinc-500 dark:text-zinc-400">Analysis not found.</p>
        <Link to="/analysis" className="mt-4 text-indigo-600 hover:underline dark:text-indigo-400">
          Start a new analysis
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link 
          to="/dashboard" 
          className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Analysis Results
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {analysis.resumeName} • {analysis.jdTitle}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {new Date(analysis.createdAt).toLocaleString()}
            {analysis.keywordScore != null ? ` • Keyword score: ${analysis.keywordScore}%` : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex">
          <AISummaryCard summary={analysis.aiSummary} />
        </div>
        <Card className="flex min-h-[220px] flex-col items-center justify-center py-4">
          <ScoreGauge score={analysis.score} />
        </Card>
      </div>

      {(analysis.keywordScore || analysis.aiModel) && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {analysis.keywordScore && (
            <MetricCard label="Keyword Score" value={`${analysis.keywordScore}%`} />
          )}
          {analysis.aiModel && (
            <MetricCard label="AI Model" value={analysis.aiModel} />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Extracted Skills</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <SkillSection
              title="Matched"
              count={analysis.matchedSkills.length}
              variant="matched"
              skills={analysis.matchedSkills}
              emptyMessage="No matched skills returned."
            />
            <SkillSection
              title="Missing"
              count={analysis.missingSkills.length}
              variant="missing"
              skills={analysis.missingSkills}
              emptyMessage="No missing skills returned."
            />
          </CardContent>
        </Card>
      </div>

      {/* Strengths & Weaknesses */}
      <StrengthsWeaknesses 
        strengths={analysis.strengths} 
        weaknesses={analysis.weaknesses} 
      />

      {/* Actionable Suggestions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Actionable Suggestions
        </h3>
        <SuggestionsAccordion suggestions={analysis.suggestions} />
      </div>

    </div>
  );
}
