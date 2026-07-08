import api from "../../../lib/axios";

// The backend wraps every response in an envelope:
// { statusCode, data, message, success }. We unwrap `data` here so the
// rest of the app only ever deals with the actual payload.
export const authApi = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data.data;
  },
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data.data;
  },
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data.data;
  },
  updateMe: async (payload) => {
    const response = await api.patch("/auth/me", payload);
    return response.data.data;
  },
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data.data;
  },
  changePassword: async (payload) => {
    const response = await api.post("/auth/change-password", payload);
    return response.data.data;
  },
};
