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

function parseRawResponse(analysis) {
  const raw = analysis?.rawResponse ?? getNestedResult(analysis).rawResponse;
  if (!raw) return {};

  if (typeof raw === "object") return raw;

  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return {};

      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return {};
      }
    }
  }

  return {};
}

function buildKeywordScores(analysis, result, parsedRaw, score) {
  const rawScores =
    analysis.keywordScores ??
    analysis.categoryScores ??
    result.keywordScores ??
    parsedRaw.keywordScores ??
    parsedRaw.categoryScores;

  if (rawScores) return normalizeKeywordScores(rawScores);

  const keywordScore = Number(
    analysis.keywordScore ??
      result.keywordScore ??
      parsedRaw.keywordScore ??
      NaN,
  );

  const scores = [];
  if (!Number.isNaN(keywordScore)) {
    scores.push({ name: "Keyword Match", score: keywordScore });
  }

  const overallScore = Number(
    analysis.overallScore ??
      result.overallScore ??
      parsedRaw.overallScore ??
      score ??
      NaN,
  );

  if (!Number.isNaN(overallScore) && overallScore !== keywordScore) {
    scores.push({ name: "Overall Match", score: overallScore });
  }

  return scores;
}

function normalizeAnalysis(analysis) {
  if (!analysis) return analysis;

  const result = getNestedResult(analysis);
  const parsedRaw = parseRawResponse(analysis);
  const resume = analysis.resume ?? analysis.resumeId ?? {};
  const jobDescription =
    analysis.jobDescription ?? analysis.jobDescriptionId ?? analysis.jd ?? {};
  const score = Number(
    analysis.score ??
      analysis.matchScore ??
      analysis.overallScore ??
      result.score ??
      result.matchScore ??
      result.overallScore ??
      parsedRaw.overallScore ??
      parsedRaw.score ??
      0,
  );
  const matchedSkills = asArray(
    analysis.matchedSkills ??
      result.matchedSkills ??
      result.matchingSkills ??
      result.matchedKeywords ??
      analysis.matchingSkills ??
      analysis.matchedKeywords ??
      analysis.skills?.matched ??
      parsedRaw.matchingSkills ??
      parsedRaw.matchedKeywords ??
      parsedRaw.skills?.matched ??
      result.matches ??
      parsedRaw.matchedSkills,
  );
  const missingSkills = asArray(
    analysis.missingSkills ??
      result.missingSkills ??
      result.missingKeywords ??
      analysis.missingKeywords ??
      analysis.skills?.missing ??
      parsedRaw.missingKeywords ??
      parsedRaw.skills?.missing ??
      result.gaps ??
      parsedRaw.missingSkills,
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
    keywordScore: Number(
      analysis.keywordScore ??
        result.keywordScore ??
        parsedRaw.keywordScore ??
        score,
    ),
    aiModel: analysis.aiModel ?? result.aiModel ?? parsedRaw.aiModel,
    rawResponse: analysis.rawResponse ?? result.rawResponse ?? parsedRaw.rawResponse,
    createdAt: analysis.createdAt ?? analysis.updatedAt ?? new Date().toISOString(),
    aiSummary:
      analysis.aiSummary ??
      analysis.summary ??
      result.aiSummary ??
      result.summary ??
      parsedRaw.summary ??
      "AI analysis completed. Review the score, skills, and suggestions below.",
    matchedSkills,
    missingSkills,
    strengths: asArray(
      analysis.strengths ?? result.strengths ?? parsedRaw.strengths,
    ),
    weaknesses: asArray(
      analysis.weaknesses ?? result.weaknesses ?? parsedRaw.weaknesses,
    ),
    keywordScores: buildKeywordScores(analysis, result, parsedRaw, score),
    suggestions: normalizeSuggestions(
      analysis.suggestions ??
        result.suggestions ?? {
          atsSuggestions:
            analysis.atsSuggestions ??
            result.atsSuggestions ??
            parsedRaw.atsSuggestions,
          grammarSuggestions:
            analysis.grammarSuggestions ??
            result.grammarSuggestions ??
            parsedRaw.grammarSuggestions,
        },
    ),
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
