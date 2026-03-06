import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

//  isAuthenticated ?
//    show page
//    OR redirect to login

// function ProtectedRoute({ children }) {
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />
//   }

//   return children
// }

// export default ProtectedRoute



function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;