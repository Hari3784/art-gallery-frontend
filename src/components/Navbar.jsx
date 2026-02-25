import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getRolePath = () => {
    if (!user) return '/gallery'
    const roleMap = {
      'Admin': '/admin',
      'Artist': '/artist',
      'Visitor': '/visitor',
      'Curator': '/curator',
    }
    return roleMap[user.role] || '/gallery'
  }

  const getRoleLabel = () => {
    const labels = {
      'Admin': '⚙️ Admin',
      'Artist': '🎨 Creator',
      'Visitor': '👤 Visitor',
      'Curator': '🖼️ Curator',
    }
    return labels[user?.role] || user?.role
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">Art Gallery</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">🏠 Home</Link>
          <Link to="/gallery" className="navbar-link">🖼️ Gallery</Link>
          <Link to="/about" className="navbar-link">ℹ️ About</Link>
          <Link to="/contact" className="navbar-link">📩 Contact</Link>

          {user ? (
            <>
              <Link to={getRolePath()} className="navbar-link">
                {getRoleLabel()} Dashboard
              </Link>

              <div className="navbar-user">
                <span className="user-badge" title={`Role: ${user.role}`}>
                  {user.role === 'Artist' ? '🎨' : user.role === 'Admin' ? '⚙️' : user.role === 'Curator' ? '🖼️' : '👤'}
                </span>
                <span className="user-name">{user.email || user.name}</span>
              </div>

              <button 
                className="btn btn-outline navbar-logout" 
                onClick={handleLogout}
                title="Log out"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="btn btn-outline navbar-auth">
                Login / Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
