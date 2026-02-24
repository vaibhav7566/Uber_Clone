// Old routing (declarative) = simple page switching

// New routing (data routing) = smart navigation system
// that can:

// fetch data before page loads

// protect routes

// run logic on navigation

import { createBrowserRouter } from "react-router-dom"
import Signup from "../pages/Signup"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup />,
  },
])