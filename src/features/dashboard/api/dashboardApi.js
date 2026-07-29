import { analysisApi } from "../../analysis/api/analysisApi";
import { jobDescriptionApi } from "../../job-descriptions/api/jobDescriptionApi";
import { resumeApi } from "../../resumes/api/resumeApi";

function averageScore(analyses) {
  if (!analyses.length) return 0;
  const total = analyses.reduce((sum, analysis) => {
    return sum + Number(analysis.score ?? analysis.overallScore ?? 0);
  }, 0);
  return Number((total / analyses.length).toFixed(1));
}

function normalizeRecentAnalysis(analysis) {
  return {
    id: analysis.id,
    resumeName: analysis.resumeName ?? "Resume",
    jobTitle: analysis.jdTitle ?? analysis.jobTitle ?? "Job description",
    score: Number(analysis.score ?? analysis.overallScore ?? 0),
    date: analysis.createdAt ?? analysis.updatedAt ?? new Date().toISOString(),
  };
}

export const dashboardApi = {
  fetchDashboardSummary: async () => {
    const [resumes, jobDescriptions, analyses] = await Promise.all([
      resumeApi.fetchResumes(),
      jobDescriptionApi.list({ page: 1, limit: 100, sort: "desc" }),
      analysisApi.getAnalysisHistory(),
    ]);

    const recentAnalyses = [...analyses]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(normalizeRecentAnalysis);

    // All analyses sorted oldest → newest for trend chart
    const allAnalyses = [...analyses]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(normalizeRecentAnalysis);

    return {
      stats: {
        resumeCount: resumes.length,
        jdCount: jobDescriptions.meta?.total ?? jobDescriptions.data.length,
        analysisCount: analyses.length,
        averageScore: averageScore(analyses),
      },
      recentAnalyses,
      allAnalyses,
      counts: {
        resumes: resumes.length,
        jds: jobDescriptions.meta?.total ?? jobDescriptions.data.length,
        analyses: analyses.length,
      },
    };
  },
};
