import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()

  // Kalau belum login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Kalau ada allowedRoles dan role user tidak termasuk
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute