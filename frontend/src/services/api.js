import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:5001/api"
});

export function setAuth(token, role) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getRole() {
  return localStorage.getItem("role");
}

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const api = {
  register: (payload) => http.post("/auth/register", payload).then((r) => r.data),
  login: (payload) => http.post("/auth/login", payload).then((r) => r.data),

  myApplications: () => http.get("/applications").then((r) => r.data),
  createApplication: (payload) => http.post("/applications", payload).then((r) => r.data),
  saveReview: (id, text) => http.post(`/applications/${id}/review`, { text }).then((r) => r.data),

  adminApplications: () => http.get("/admin/applications").then((r) => r.data),
  adminSetStatus: (id, status) => http.patch(`/admin/applications/${id}/status`, { status }).then((r) => r.data)
};
