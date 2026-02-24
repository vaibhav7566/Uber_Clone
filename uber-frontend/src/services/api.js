import axios from "axios";

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

export default API;
