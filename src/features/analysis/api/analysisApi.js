import api from "../../../lib/axios";

// Mock database for analyses
let mockAnalyses = {};

const generateRichMockAnalysis = (id, resumeId, jdId) => {
  return {
    id,
    resumeId,
    jdId,
    resumeName: "John_Doe_Frontend.pdf", // Mocked for history view
    jdTitle: "Senior React Developer", // Mocked for history view
    score: Math.floor(Math.random() * 40) + 50, // 50-90
    createdAt: new Date().toISOString(),
    aiSummary: "Your resume matches the core requirements of this role quite well, particularly in frontend technologies like React. However, you are missing some key backend concepts and cloud deployment keywords that the ATS might filter for. Highlighting your recent DevOps experience could bridge this gap.",
    matchedSkills: ["React", "JavaScript", "Tailwind CSS", "Git", "REST APIs"],
    missingSkills: ["Node.js", "Docker", "AWS", "GraphQL", "CI/CD"],
    strengths: [
      "Strong match for frontend framework requirements.",
      "Good use of action verbs in recent roles.",
      "Clear formatting that ATS systems can easily parse."
    ],
    weaknesses: [
      "Lacks explicit mention of containerization (Docker).",
      "Missing keywords related to cloud infrastructure.",
      "Some bullet points are too long and lack quantifiable metrics."
    ],
    keywordScores: [
      { name: "Frontend", score: 95 },
      { name: "Backend", score: 40 },
      { name: "DevOps", score: 20 },
      { name: "Soft Skills", score: 85 },
      { name: "Testing", score: 60 }
    ],
    suggestions: {
      grammar: [
        "Change 'Lead a team...' to 'Led a team...' under your current role.",
        "Ensure consistent punctuation at the end of all bullet points."
      ],
      ats: [
        "Add a 'Skills' section specifically listing 'Docker' and 'AWS' if you have experience with them.",
        "Rephrase 'Worked with API' to 'Designed and consumed RESTful APIs' to hit exact keyword matches.",
        "Include quantifiable metrics (e.g., 'improved performance by X%') to boost ATS ranking algorithms."
      ]
    }
  };
};

export const analysisApi = {
  createAnalysis: async (resumeId, jdId) => {
    // Mock implementation with 5 second delay to show off loading state
    return new Promise((resolve) => {
      setTimeout(() => {
        const id = Math.random().toString(36).substr(2, 9);
        mockAnalyses[id] = generateRichMockAnalysis(id, resumeId, jdId);
        resolve({ id });
      }, 5000); 
    });
  },

  getAnalysisById: async (id) => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        if (mockAnalyses[id]) {
          resolve(mockAnalyses[id]);
        } else {
          // If we refresh on a mocked ID that was lost from memory
          const newMock = generateRichMockAnalysis(id, "mock-resume", "mock-jd");
          mockAnalyses[id] = newMock;
          resolve(newMock);
        }
      }, 500);
    });
  },
  
  getAnalysisHistory: async () => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.values(mockAnalyses).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }, 500);
    });
  }
};

