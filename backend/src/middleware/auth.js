import { verifyToken } from '../utils/jwt.js'
import { env } from '../config/env.js'

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid authorization token' })
  }

  try {
    const token = authHeader.slice(7)
    req.user = verifyToken(token)
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient role permissions' })
    }

    if (
      roles.includes('ADMIN') &&
      req.user.role === 'ADMIN' &&
      env.adminEmail &&
      req.user.email?.toLowerCase() !== env.adminEmail
    ) {
      return res.status(403).json({ message: 'Admin access denied for this account' })
    }

    return next()
  }
}
