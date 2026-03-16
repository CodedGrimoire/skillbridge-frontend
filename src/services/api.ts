import axios from "axios";

// Central axios instance for the Express API.
const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

// Attach JWT from localStorage to every request (browser only).
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Basic 401 handler: remove stale token and bounce to login.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== "undefined" && err?.response?.status === 401) {
      const path = window.location.pathname;
      // Avoid redirect loop when already on auth pages
      const onAuthPage = path.startsWith("/login") || path.startsWith("/register");
      localStorage.removeItem("token");
      if (!onAuthPage) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
