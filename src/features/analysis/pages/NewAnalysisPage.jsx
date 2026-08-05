import { useState } from "react";
import { ResumeSelect } from "../components/ResumeSelect";
import { JobDescriptionSelect } from "../components/JobDescriptionSelect";
import { AnalysisLoadingState } from "../components/AnalysisLoadingState";
import { useCreateAnalysis } from "../hooks/useCreateAnalysis";
import { Button } from "../../../components/ui/Button";
import { Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { CoachMark } from "../../../components/Onboarding/CoachMark";
import { useOnboarding } from "../../../components/Onboarding/OnboardingContext";

export function NewAnalysisPage() {
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [selectedJdId, setSelectedJdId] = useState(null);
  const { isActive, currentStep, complete } = useOnboarding();
  const showCoachMark = isActive && currentStep === 3;

  const { mutate: createAnalysis, isPending } = useCreateAnalysis();

  const handleAnalyze = () => {
    if (selectedResumeId && selectedJdId) {
      createAnalysis(
        { resumeId: selectedResumeId, jdId: selectedJdId },
        { onSuccess: () => { if (isActive && currentStep === 3) complete(); } }
      );
    }
  };

  if (isPending) {
    return (
      <div className="mx-auto max-w-4xl py-8 sm:py-12">
        <AnalysisLoadingState />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
          New Analysis
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Select a resume and job description, then run the AI match analysis.
        </p>
      </div>

      {/* Onboarding guidance */}
      {showCoachMark && (
        <CoachMark targetLabel="Select resume, job description, then click Analyze" />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="flex min-h-[360px] flex-col lg:h-[400px]">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
            <CardTitle className="text-lg">1. Choose Resume</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-3">
            <ResumeSelect
              selectedId={selectedResumeId}
              onSelect={setSelectedResumeId}
            />
          </CardContent>
        </Card>

        <Card className="flex min-h-[360px] flex-col lg:h-[400px]">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
            <CardTitle className="text-lg">2. Choose Job Description</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-3">
            <JobDescriptionSelect
              selectedId={selectedJdId}
              onSelect={setSelectedJdId}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          onClick={handleAnalyze}
          disabled={!selectedResumeId || !selectedJdId}
          isLoading={isPending}
          className="w-full sm:w-auto"
        >
          <Zap className="mr-2 h-5 w-5" />
          Run AI Analysis
        </Button>
      </div>
    </div>
  );
}
