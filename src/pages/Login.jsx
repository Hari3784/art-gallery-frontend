import { useMemo, useState } from 'react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const generateCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let value = ''
  for (let index = 0; index < 5; index += 1) {
    value += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return value
}

export default function Login({
  selectedRole,
  roles,
  loading,
  loginForm,
  setLoginForm,
  onLogin,
  setError,
}) {
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha)
  const [captchaInput, setCaptchaInput] = useState('')

  const selectedRoleLabel = useMemo(
    () => roles.find((role) => role.id === selectedRole)?.label,
    [roles, selectedRole]
  )

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha())
    setCaptchaInput('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const email = loginForm.email.trim()
    const password = loginForm.password

    if (!EMAIL_REGEX.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!password) {
      setError('Please enter email and password')
      return
    }

    if (captchaInput.trim() !== captchaCode) {
      setError('Invalid CAPTCHA. Please try again.')
      refreshCaptcha()
      return
    }

    await onLogin(email, password)
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Welcome Back, {selectedRoleLabel}!</h2>
      <p className="form-subtitle">Sign in to your {selectedRole.toLowerCase()} account</p>

      <div className="form-group">
        <label htmlFor="login-email">Email Address</label>
        <input
          id="login-email"
          type="email"
          className="input"
          placeholder="you@example.com"
          value={loginForm.email}
          onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          className="input"
          placeholder="••••••••"
          value={loginForm.password}
          onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="captcha-display">CAPTCHA</label>
        <div id="captcha-display" className="input" aria-live="polite">
          {captchaCode}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="captcha-input">Enter CAPTCHA</label>
        <input
          id="captcha-input"
          type="text"
          className="input"
          placeholder="Enter 5-character code"
          value={captchaInput}
          onChange={(event) => setCaptchaInput(event.target.value)}
          maxLength={5}
          required
          disabled={loading}
        />
      </div>

      <button type="button" className="btn btn-outline" onClick={refreshCaptcha} disabled={loading}>
        Refresh CAPTCHA
      </button>

      <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
        {loading ? '🔄 Signing in...' : '✓ Sign In'}
      </button>

      <div className="form-links">
        <a href="#forgot" className="link">Forgot password?</a>
      </div>
    </form>
  )
}