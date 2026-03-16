import axios from "axios";

// Axios instance pointing to the Express API; adjust baseURL for deployment.
const api = axios.create({
  baseURL: "http://localhost:5000/api",
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

export default api;
