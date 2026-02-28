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

import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import Riding from "../components/Riding";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },

  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },

  {
    path: "/rider/home",
    element: (
      <ProtectedRoute>
        <RiderHome />
      </ProtectedRoute>
    ),
  },

  {
    path: "/driver/dashboard",
    element: (
      <ProtectedRoute>
        <DriverDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/riding",
    element: (
      <ProtectedRoute>
        <Riding />
      </ProtectedRoute> 
    ),
  }
]);
