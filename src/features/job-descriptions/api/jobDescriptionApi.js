import api from "../../../lib/axios";

// Mock database for JDs
let mockJDs = [
  { id: "1", title: "Senior Frontend Engineer", company: "TechCorp", content: "We are looking for a React expert...", date: "2026-07-01T10:00:00Z" },
  { id: "2", title: "Backend Node.js Developer", company: "DataSync", content: "Strong experience with Node and Express required.", date: "2026-07-02T12:00:00Z" },
  { id: "3", title: "Full Stack Developer", company: "StartupInc", content: "React on the frontend, Node on the backend.", date: "2026-07-03T09:00:00Z" },
  { id: "4", title: "React Native Engineer", company: "MobileFirst", content: "Build cross platform apps.", date: "2026-07-04T15:00:00Z" },
  { id: "5", title: "UI/UX Designer", company: "DesignStudio", content: "Figma expert needed.", date: "2026-07-05T11:00:00Z" },
];

export const jobDescriptionApi = {
  list: async ({ search, page, limit = 4 }) => {
    // const response = await api.get(`/jds`, { params: { search, page, limit } });
    // return response.data;
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = mockJDs;
        if (search) {
          const lowerSearch = search.toLowerCase();
          filtered = mockJDs.filter(jd => 
            jd.title.toLowerCase().includes(lowerSearch) || 
            jd.company.toLowerCase().includes(lowerSearch)
          );
        }
        
        // Sort by date descending
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        const startIndex = (page - 1) * limit;
        const paginatedItems = filtered.slice(startIndex, startIndex + limit);
        
        resolve({
          data: paginatedItems,
          meta: {
            total: filtered.length,
            page,
            limit,
            totalPages: Math.ceil(filtered.length / limit)
          }
        });
      }, 400); // simulate network delay
    });
  },

  create: async (data) => {
    // const response = await api.post("/jds", data);
    // return response.data;
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const newJD = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString()
        };
        mockJDs = [...mockJDs, newJD];
        resolve(newJD);
      }, 500);
    });
  },

  update: async ({ id, data }) => {
    // const response = await api.put(`/jds/${id}`, data);
    // return response.data;

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        mockJDs = mockJDs.map(jd => jd.id === id ? { ...jd, ...data } : jd);
        resolve(mockJDs.find(jd => jd.id === id));
      }, 500);
    });
  },

  delete: async (id) => {
    // const response = await api.delete(`/jds/${id}`);
    // return response.data;

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        mockJDs = mockJDs.filter(jd => jd.id !== id);
        resolve({ success: true });
      }, 500);
    });
  }
};
