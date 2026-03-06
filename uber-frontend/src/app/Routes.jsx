// Old routing (declarative) = simple page switching

// New routing (data routing) = smart navigation system
// that can:

// fetch data before page loads

// protect routes

// run logic on navigation

//  We will use react-router-dom v6.14 which has a new data routing API

//  We will define our routes in a separate file (Routes.jsx) and use RouterProvider in main.jsx
// We will create a ProtectedRoute component that checks if the user is authenticated before showing the page
// We will use role based navigation to show different dashboards for drivers and riders

// 1. create routes with createBrowserRouter
// 2. wrap protected routes with ProtectedRoute component
// 3. wrap public routes with PublicRoute component (optional, for redirecting logged in users away from login/signup pages)
// 4. use RouterProvider in main.jsx to provide the router to the app
// 5. use useNavigate for programmatic navigation after login/logout
// Bonus: use loader functions in routes to fetch data before page loads

import { createBrowserRouter } from "react-router-dom";

import Signup from "../pages/Signup";
import Login from "../pages/Login";
import RiderHome from "../pages/RiderHome";
import DriverDashboard from "../pages/DriverDashboard";
import AdminDashboard from "../pages/AdminDashboard";

import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import Riding from "../components/Riding";
import DriverRegistration from "../pages/DriverRegistration";

export const router = createBrowserRouter([
  // Signup route (only accessible to unauthenticated users)
  {
    path: "/",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },

  // Login route (only accessible to unauthenticated users)
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },

  // Rider home route (only accessible to authenticated users with RIDER role)
  {
    path: "/rider/home",
    element: (
      <ProtectedRoute>
        <RiderHome />
      </ProtectedRoute>
    ),
  },

  // Driver dashboard route (only accessible to authenticated users with DRIVER role)
  {
    path: "/driver/dashboard",
    element: (
      <ProtectedRoute requiredRole="DRIVER">
        <DriverDashboard />
      </ProtectedRoute>
    ),
  },

  // Riding page (only accessible to authenticated users, both drivers and riders)
  {
    path: "/riding",
    element: (
      <ProtectedRoute>
        <Riding />
      </ProtectedRoute>
    ),
  },

  // Driver registration route (only accessible to authenticated users who are not yet drivers)
  {
    path: "/driver/registration",
    element: (
      <ProtectedRoute>
        <DriverRegistration />
      </ProtectedRoute>
    ),
  },

  // Admin dashboard route (only accessible to users with ADMIN role)
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },

]);
