import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

const API_BASE_URL = 'http://localhost:5000/api/v1'
const normalizeRole = (role = 'VISITOR') => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser({ ...parsedUser, role: normalizeRole(parsedUser.role || 'VISITOR') })
      } catch (err) {
        console.error('Failed to parse stored user:', err)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password, role = 'Visitor') => {
    setLoading(true)
    setError(null)
    try {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Login failed')
        }
        
        const data = await response.json()
        const userData = {
          ...data.user,
          role: normalizeRole(data.user.role || 'VISITOR'),
        }
        
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        return userData
      } catch (fetchErr) {
        // If backend is not available, use demo mode
        if (fetchErr instanceof TypeError && fetchErr.message.includes('fetch')) {
          console.log('Demo mode: Backend not available, using local storage')
          const demoToken = `demo_token_${Date.now()}`
          const userData = {
            id: Math.floor(Math.random() * 10000),
            name: email.split('@')[0],
            email: email,
            role: normalizeRole(role || 'VISITOR'),
          }
          localStorage.setItem('token', demoToken)
          localStorage.setItem('user', JSON.stringify(userData))
          setUser(userData)
          return userData
        }
        throw fetchErr
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password, role = 'Visitor', mobile = '') => {
    setLoading(true)
    setError(null)
    
    if (!name || !email || !password) {
      const err = new Error('Name, email, and password are required')
      setError(err.message)
      setLoading(false)
      throw err
    }

    if (!['Admin', 'Artist', 'Visitor', 'Curator'].includes(role)) {
      const err = new Error('Invalid role selected')
      setError(err.message)
      setLoading(false)
      throw err
    }

    try {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            mobile: mobile || '',
            role: role === 'Artist' ? 'ARTIST' : role.toUpperCase(),
          }),
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Registration failed')
        }
        
        const data = await response.json()
        const userData = {
          ...data.user,
          role: normalizeRole(data.user.role || role || 'VISITOR'),
        }
        
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        return userData
      } catch (fetchErr) {
        // If backend is not available, use demo mode
        if (fetchErr instanceof TypeError && fetchErr.message.includes('fetch')) {
          console.log('Demo mode: Backend not available, using local storage')
          const demoToken = `demo_token_${Date.now()}`
          const userData = {
            id: Math.floor(Math.random() * 10000),
            name: name,
            email: email,
            role: normalizeRole(role || 'VISITOR'),
            mobile: mobile || '',
          }
          localStorage.setItem('token', demoToken)
          localStorage.setItem('user', JSON.stringify(userData))
          setUser(userData)
          return userData
        }
        throw fetchErr
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setError(null)
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}
