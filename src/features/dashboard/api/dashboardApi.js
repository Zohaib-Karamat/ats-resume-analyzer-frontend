import api from "../../../lib/axios";

export const dashboardApi = {
  fetchDashboardSummary: async () => {
    // In a real scenario, this would be:
    // const response = await api.get("/dashboard/summary");
    // return response.data;
    
    // Mocking response based on our planned shape to avoid backend dependency blockers right now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          stats: {
            resumeCount: 124,
            jdCount: 18,
            analysisCount: 45,
            averageScore: 78.5
          },
          recentAnalyses: [
            {
              id: "1",
              resumeName: "John_Doe_Frontend.pdf",
              jobTitle: "Senior React Developer",
              score: 85,
              date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
            },
            {
              id: "2",
              resumeName: "Jane_Smith_Backend.pdf",
              jobTitle: "Node.js Engineer",
              score: 92,
              date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
            },
            {
              id: "3",
              resumeName: "Alex_Johnson_Fullstack.pdf",
              jobTitle: "Fullstack Developer",
              score: 45,
              date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // 2 days ago
            }
          ]
        });
      }, 800); // simulate network latency
    });
  }
};
