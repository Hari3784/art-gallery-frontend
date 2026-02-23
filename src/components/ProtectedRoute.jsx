import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>🔄 Loading...</p>
      </div>
    )
  }

  // Not logged in - redirect to home
  if (!user) {
    return <Navigate to="/" replace />
  }

  // Logged in but wrong role - redirect to home
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}
