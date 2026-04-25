import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => api.post("/users/register", data);
export const loginUser = (data) => api.post("/users/login", data);

// Reports
export const createReport = (formData) =>
  api.post("/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getReports = () => api.get("/reports");
export const getMyReports = () => api.get("/reports/my");

export const deleteReport = (id) => api.delete(`/reports/${id}`);

export const updateReportStatus = (id, status) =>
  api.put(`/reports/${id}/status`, { status });

export default api;
