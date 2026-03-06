import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function PublicRoute({ children }) {
  const { isAuthenticated, role } = useSelector((state) => state.auth)

  // if already logged in → redirect to correct dashboard based on role
  if (isAuthenticated) {
    if (role === "DRIVER") {
      return <Navigate to="/driver/dashboard" replace />
    } else if (role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />
    } else if (role === "RIDER") {
      // Default for RIDER or any other role
      return <Navigate to="/rider/home" replace />
    }
  }

  return children
}

export default PublicRoute