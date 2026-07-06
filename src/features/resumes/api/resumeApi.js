import api from "../../../lib/axios";

// Mock data to simulate backend response
let mockResumes = [
  { id: "1", name: "John_Doe_Frontend.pdf", size: 1024 * 1024 * 1.5, uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: "2", name: "Jane_Smith_Backend.pdf", size: 1024 * 500, uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
];

export const resumeApi = {
  fetchResumes: async () => {
    // const response = await api.get("/resumes");
    // return response.data;
    
    // Mock implementation
    return new Promise((resolve) => setTimeout(() => resolve(mockResumes), 500));
  },

  uploadResume: async (file, onUploadProgress) => {
    // const formData = new FormData();
    // formData.append("resume", file);
    // const response = await api.post("/resumes/upload", formData, {
    //   headers: { "Content-Type": "multipart/form-data" },
    //   onUploadProgress,
    // });
    // return response.data;

    // Mock implementation with simulated progress
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        if (onUploadProgress) {
          onUploadProgress({ loaded: progress, total: 100 });
        }
        if (progress >= 100) {
          clearInterval(interval);
          const newResume = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            uploadDate: new Date().toISOString()
          };
          mockResumes = [newResume, ...mockResumes];
          resolve(newResume);
        }
      }, 300);
    });
  },

  deleteResume: async (id) => {
    // const response = await api.delete(`/resumes/${id}`);
    // return response.data;

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        mockResumes = mockResumes.filter(r => r.id !== id);
        resolve({ success: true });
      }, 500);
    });
  }
};
