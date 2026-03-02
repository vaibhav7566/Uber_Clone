import axios from "axios";
import { store } from "../store/store.js";
import { logout } from "../features/auth/authSlice.js";
import { toast } from "react-toastify";

// API instance
// Axios instance will:

// set base URL (http://localhost:3000/api)
// automatically attach JWT token
// handle request globally
// reusable across app

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

// attach token automatically

// ==> We add interceptor.
// 🧠 What interceptor does
// Before every API call:
// 👉 check token
// 👉 attach header
// So driver routes, profile routes — work automatically.
// No manual header writing.


API.interceptors.request.use((config) => {  // config = Axios request config object. It contains details about the request being made, such as the URL, method, headers, and data. We can modify this config object before the request is sent out.
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor - Handle 401 errors (token expired)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      store.dispatch(logout());
      
      // Show toast first, then redirect after it's visible
      toast.error("Session expired. Please login again!", {
        autoClose: 3000,
        onClose: () => {
          window.location.href = "/login";
        }
      });
    }
    return Promise.reject(error);
  }
);

export default API;
