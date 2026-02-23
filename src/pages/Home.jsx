import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Login from './Login'

const ROLES = [
  { id: 'Visitor', label: 'Visitor', icon: '👤', description: 'Browse & collect art' },
  { id: 'Artist', label: 'Creator', icon: '🎨', description: 'Upload your artwork' },
  { id: 'Curator', label: 'Curator', icon: '🖼️', description: 'Curate exhibitions' },
  { id: 'Admin', label: 'Admin', icon: '⚙️', description: 'Manage platform' },
]

export default function Home({ exhibitions = [] }) {
  const { user, error: authError, clearError } = useContext(AuthContext)
  const { login, register } = useContext(AuthContext)
  const navigate = useNavigate()

  const spotlightExhibitions = exhibitions
    .slice()
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3)

  const [isLogin, setIsLogin] = useState(true)
  const [selectedRole, setSelectedRole] = useState('Visitor')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
  })

  const handleLogin = async (email, password) => {
    setLoading(true)
    setError('')

    try {
      const userData = await login(email, password, selectedRole)
      
      // Redirect based on role
      const rolePath = {
        'Admin': '/admin',
        'Artist': '/artist',
        'Visitor': '/visitor',
        'Curator': '/curator',
      }[userData.role] || '/gallery'

      navigate(rolePath)
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const userData = await register(
        registerForm.name,
        registerForm.email,
        registerForm.password,
        selectedRole,
        registerForm.mobile
      )

      // Redirect based on role
      const rolePath = {
        'Admin': '/admin',
        'Artist': '/artist',
        'Visitor': '/visitor',
        'Curator': '/curator',
      }[userData.role] || '/gallery'

      navigate(rolePath)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <div className="page home-page home-page-bg">
        <div className="home-page-overlay" aria-hidden="true" />
        <div className="home-page-content">
          <section className="hero-section">
            <div className="hero-content">
              <h1>Welcome back, {user.name}! 👋</h1>
              <p>You are logged in as <strong>{user.role}</strong></p>
              <div className="hero-buttons">
                <button className="btn btn-primary" onClick={() => navigate('/gallery')}>
                  Explore Gallery
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/gallery')}>
                  Continue Shopping
                </button>
              </div>
            </div>
          </section>

          {spotlightExhibitions.length > 0 && (
            <section className="panel">
              <h3>Today&apos;s Curator Highlights</h3>
              {spotlightExhibitions.map((showcase) => (
                <article key={showcase.id} className="card compact">
                  <h4>{showcase.title}</h4>
                  <p><strong>Theme:</strong> {showcase.theme || 'General'} · <strong>Culture:</strong> {showcase.culture || 'Global'}</p>
                  <p>{showcase.featured ? '🔥 Featured Today' : '✨ New curator pick'}</p>
                  <p>{showcase.commentary || 'Visit this exhibition for a guided cultural perspective.'}</p>
                </article>
              ))}
            </section>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="page home-page home-page-bg">
      <div className="home-page-overlay" aria-hidden="true" />
      <div className="home-page-content">
        <section className="hero-section">
          <div className="hero-content">
            <h1>🎨 Discover & Collect Exceptional Art</h1>
            <p>Connect with artists, curators, and collectors worldwide</p>
          </div>
        </section>

        {spotlightExhibitions.length > 0 && (
          <section className="panel">
            <h3>Today&apos;s Curator Highlights</h3>
            {spotlightExhibitions.map((showcase) => (
              <article key={showcase.id} className="card compact">
                <h4>{showcase.title}</h4>
                <p><strong>Theme:</strong> {showcase.theme || 'General'} · <strong>Culture:</strong> {showcase.culture || 'Global'}</p>
                <p>{showcase.featured ? '🔥 Featured Today' : '✨ New curator pick'}</p>
                <p>{showcase.commentary || 'Sign in to explore this exhibition in detail.'}</p>
              </article>
            ))}
          </section>
        )}

        <section className="auth-section">
          <div className="auth-container">
            {/* Tab Navigation */}
            <div className="auth-tabs">
              <button
                className={`tab ${isLogin ? 'active' : ''}`}
                onClick={() => {
                  setIsLogin(true)
                  setError('')
                  clearError()
                }}
              >
                Sign In
              </button>
              <button
                className={`tab ${!isLogin ? 'active' : ''}`}
                onClick={() => {
                  setIsLogin(false)
                  setError('')
                  clearError()
                }}
              >
                Create Account
              </button>
            </div>

          {/* Role Selection */}
          <div className="role-selection">
            <label className="role-label">Select Your Role</label>
            <div className="role-buttons">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  className={`role-btn ${selectedRole === role.id ? 'active' : ''}`}
                  onClick={() => setSelectedRole(role.id)}
                  title={role.description}
                >
                  <span className="role-icon">{role.icon}</span>
                  <span className="role-name">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Messages */}
          {error && (
            <div className="error-message">
              <span>❌</span> {error}
            </div>
          )}
          {authError && (
            <div className="error-message">
              <span>❌</span> {authError}
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <Login
              selectedRole={selectedRole}
              roles={ROLES}
              loading={loading}
              loginForm={loginForm}
              setLoginForm={setLoginForm}
              onLogin={handleLogin}
              setError={setError}
            />
          ) : (
            /* Registration Form */
            <form className="auth-form" onSubmit={handleRegister}>
              <h2>Join as a {ROLES.find(r => r.id === selectedRole)?.label}</h2>
              <p className="form-subtitle">Create your {selectedRole.toLowerCase()} account</p>

              <div className="form-group">
                <label htmlFor="register-name">Full Name</label>
                <input
                  id="register-name"
                  type="text"
                  className="input"
                  placeholder="John Doe"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-email">Email Address</label>
                <input
                  id="register-email"
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-mobile">Mobile Number</label>
                <input
                  id="register-mobile"
                  type="tel"
                  className="input"
                  placeholder="10-digit mobile number"
                  value={registerForm.mobile}
                  onChange={(e) => setRegisterForm({ ...registerForm, mobile: e.target.value })}
                  pattern="\d{10}"
                  title="Enter 10-digit mobile number"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  type="password"
                  className="input"
                  placeholder="Min 6 characters"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  required
                  minLength="6"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-confirm">Confirm Password</label>
                <input
                  id="register-confirm"
                  type="password"
                  className="input"
                  placeholder="Confirm password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  required
                  minLength="6"
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                {loading ? '🔄 Creating account...' : '✓ Create Account'}
              </button>

              <p className="form-terms">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          )}
          </div>
        </section>
      </div>
    </div>
  )
}
