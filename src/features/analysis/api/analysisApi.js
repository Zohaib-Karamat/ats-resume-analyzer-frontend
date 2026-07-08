import api from "../../../lib/axios";

function unwrapData(response) {
  return response.data?.data ?? response.data;
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
}

function normalizeKeywordScores(rawScores) {
  if (Array.isArray(rawScores)) {
    return rawScores.map((item) => ({
      name: item.name ?? item.category ?? item.label ?? "Score",
      score: Number(item.score ?? item.value ?? 0),
    }));
  }

  if (rawScores && typeof rawScores === "object") {
    return Object.entries(rawScores).map(([name, score]) => ({
      name,
      score: Number(score ?? 0),
    }));
  }

  return [];
}

function normalizeSuggestions(value) {
  const suggestions = value ?? {};

  if (Array.isArray(suggestions)) {
    return { ats: suggestions, grammar: [] };
  }

  return {
    ats: asArray(suggestions.ats ?? suggestions.atsSuggestions ?? suggestions.optimization),
    grammar: asArray(suggestions.grammar ?? suggestions.grammarSuggestions ?? suggestions.phrasing),
  };
}

function getNestedResult(analysis) {
  return analysis?.result ?? analysis?.analysis ?? analysis?.aiAnalysis ?? {};
}

function normalizeAnalysis(analysis) {
  if (!analysis) return analysis;

  const result = getNestedResult(analysis);
  const resume = analysis.resume ?? analysis.resumeId ?? {};
  const jobDescription =
    analysis.jobDescription ?? analysis.jobDescriptionId ?? analysis.jd ?? {};
  const score = Number(
    analysis.score ??
      analysis.matchScore ??
      analysis.overallScore ??
      result.score ??
      result.matchScore ??
      0,
  );
  const matchedSkills = asArray(
    analysis.matchedSkills ?? result.matchedSkills ?? result.matches,
  );
  const missingSkills = asArray(
    analysis.missingSkills ?? result.missingSkills ?? result.gaps,
  );

  return {
    ...analysis,
    id: analysis.id ?? analysis._id,
    resumeId: typeof resume === "object" ? resume.id ?? resume._id : resume,
    jdId:
      typeof jobDescription === "object"
        ? jobDescription.id ?? jobDescription._id
        : jobDescription,
    resumeName:
      analysis.resumeName ??
      resume.originalFileName ??
      resume.name ??
      resume.fileName ??
      "Resume",
    jdTitle:
      analysis.jdTitle ??
      analysis.jobTitle ??
      jobDescription.title ??
      "Job description",
    score,
    createdAt: analysis.createdAt ?? analysis.updatedAt ?? new Date().toISOString(),
    aiSummary:
      analysis.aiSummary ??
      analysis.summary ??
      result.aiSummary ??
      result.summary ??
      "AI analysis completed. Review the score, skills, and suggestions below.",
    matchedSkills,
    missingSkills,
    strengths: asArray(analysis.strengths ?? result.strengths),
    weaknesses: asArray(analysis.weaknesses ?? result.weaknesses),
    keywordScores: normalizeKeywordScores(
      analysis.keywordScores ?? analysis.categoryScores ?? result.keywordScores,
    ),
    suggestions: normalizeSuggestions(analysis.suggestions ?? result.suggestions),
  };
}

function normalizeList(payload) {
  const rawItems = Array.isArray(payload)
    ? payload
    : payload?.analyses ?? payload?.analysis ?? payload?.items ?? payload?.data ?? [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems].filter(Boolean);

  return items.map(normalizeAnalysis);
}

function normalizePayload(payload) {
  return normalizeAnalysis(payload?.analysis ?? payload);
}

export const analysisApi = {
  createAnalysis: async ({ resumeId, jobDescriptionId }) => {
    const response = await api.post("/analysis", {
      resumeId,
      jobDescriptionId,
    });
    return normalizePayload(unwrapData(response));
  },

  getAnalysisById: async (id) => {
    const response = await api.get(`/analysis/${id}`);
    return normalizePayload(unwrapData(response));
  },

  getAnalysisHistory: async () => {
    const response = await api.get("/analysis");
    return normalizeList(unwrapData(response));
  },

  deleteAnalysis: async (id) => {
    const response = await api.delete(`/analysis/${id}`);
    return unwrapData(response);
  },
};
