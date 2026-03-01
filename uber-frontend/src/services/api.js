import axios from "axios";
import { store } from "../store/store";
import { logout } from "../features/auth/authSlice";

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

// Response interceptor to handle 401 (unauthorized/expired token)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend returns 401 (Unauthorized/Token Expired)
    if (error.response?.status === 401) {
      // Clear token from localStorage
      localStorage.removeItem("token");
      
      // Dispatch logout action to Redux
      store.dispatch(logout());
      
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
