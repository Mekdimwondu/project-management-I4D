// src/api/apiService.js
import axios from "axios";

// Create an instance of axios
const apiService = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`, // Base URL for all your API requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to include token in headers
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("User");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors like token expiration
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 500) {
      // Token expired or user unauthorized
      localStorage.removeItem("User"); // Clear the token
      window.location.href = "/session-expired"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default apiService;
