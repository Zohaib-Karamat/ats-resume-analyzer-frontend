import api from "../../../lib/axios";

export const coverLettersApi = {
  generate: async ({ resumeId, jobDescriptionId }) => {
    const response = await api.post("/cover-letters/generate", {
      resumeId,
      jobDescriptionId,
    });
    return response.data.data;
  },

  getAll: async () => {
    const response = await api.get("/cover-letters");
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/cover-letters/${id}`);
    return response.data.data;
  },

  downloadPdf: async (id) => {
    const response = await api.get(`/cover-letters/${id}/pdf`, {
      responseType: "blob", // Important for handling the PDF download
    });
    return response.data; // Note: for blobs, the data is the blob itself usually
  },

  delete: async (id) => {
    const response = await api.delete(`/cover-letters/${id}`);
    return response.data.data;
  },
};
