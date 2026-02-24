import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function PublicRoute({ children }) {
  const { isAuthenticated, role } = useSelector((state) => state.auth)

  // if already logged in → redirect to dashboard
  if (isAuthenticated) {
    if (role === "DRIVER") {
      return <Navigate to="/driver/dashboard" replace />
    }
    return <Navigate to="/rider/home" replace />
  }

  return children
}

export default PublicRoute