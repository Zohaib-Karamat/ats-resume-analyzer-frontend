import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAnalysis } from "../hooks/useAnalysis";
import { ScoreGauge } from "../components/ScoreGauge";
import { KeywordMatchChart } from "../components/KeywordMatchChart";
import { SkillDistributionChart } from "../components/SkillDistributionChart";
import { SkillChip } from "../components/SkillChip";
import { StrengthsWeaknesses } from "../components/StrengthsWeaknesses";
import { SuggestionsAccordion } from "../components/SuggestionsAccordion";
import { AISummaryCard } from "../components/AISummaryCard";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Skeleton } from "../../../components/ui/Skeleton";
import { QueryErrorState } from "../../../components/ui/States";

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
            ID: {analysis.id} • {new Date(analysis.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Top Row: AI Summary & Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col justify-center">
          <AISummaryCard summary={analysis.aiSummary} />
        </div>
        <Card className="flex flex-col items-center justify-center py-6">
          <ScoreGauge score={analysis.score} />
        </Card>
      </div>

      {/* Middle Row: Charts & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Category Scores */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Keyword Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <KeywordMatchChart data={analysis.keywordScores} />
          </CardContent>
        </Card>

        {/* Skill Distribution */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Skill Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillDistributionChart 
              matchedCount={analysis.matchedSkills.length} 
              missingCount={analysis.missingSkills.length} 
            />
          </CardContent>
        </Card>

        {/* Skills Lists */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-base">Extracted Skills</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-6 overflow-y-auto">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
                Matched ({analysis.matchedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.matchedSkills.map(skill => (
                  <SkillChip key={skill} skill={skill} variant="matched" />
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-3">
                Missing ({analysis.missingSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map(skill => (
                  <SkillChip key={skill} skill={skill} variant="missing" />
                ))}
              </div>
            </div>
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
