import axios from "axios";

const api = axios.create({
  baseURL: "/api", // adjust if backend runs on different port (e.g. http://localhost:5000/api)
});

// Add token automatically if exists
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const token = JSON.parse(userInfo).token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
