import express from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../config/db.js'
import { signToken } from '../utils/jwt.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { env } from '../config/env.js'

const router = express.Router()

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password, role = 'VISITOR' } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required' })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const normalizedRole = String(role).trim().toUpperCase()

    if (normalizedRole === 'ADMIN' && (!env.adminEmail || normalizedEmail !== env.adminEmail)) {
      return res.status(403).json({ message: 'Admin account registration is not allowed for this email' })
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [normalizedEmail])
    if (existing.length) {
      return res.status(409).json({ message: 'Email already exists' })
    }

    const [roles] = await pool.query('SELECT id, name FROM roles WHERE name = ?', [normalizedRole])
    if (!roles.length) {
      return res.status(400).json({ message: 'Invalid role value' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
      [name, normalizedEmail, passwordHash, roles[0].id],
    )

    const userPayload = {
      id: result.insertId,
      name,
      email: normalizedEmail,
      role: roles[0].name,
    }

    return res.status(201).json({
      token: signToken(userPayload),
      user: userPayload,
    })
  }),
)

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' })
    }

    const normalizedEmail = String(email).trim().toLowerCase()

    const [users] = await pool.query(
      `SELECT u.id, u.name, u.email, u.password_hash, r.name AS role
       FROM users u
       INNER JOIN roles r ON r.id = u.role_id
       WHERE LOWER(u.email) = ? AND u.is_active = TRUE`,
      [normalizedEmail],
    )

    if (!users.length) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const validPassword = await bcrypt.compare(password, users[0].password_hash)
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const userPayload = {
      id: users[0].id,
      name: users[0].name,
      email: users[0].email,
      role: users[0].role,
    }

    if (userPayload.role === 'ADMIN' && env.adminEmail && userPayload.email.toLowerCase() !== env.adminEmail) {
      return res.status(403).json({ message: 'Admin account not permitted for this email' })
    }

    return res.json({
      token: signToken(userPayload),
      user: userPayload,
    })
  }),
)

router.post('/forgot-password', (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ message: 'email is required' })
  }
  return res.json({ message: 'Password reset link processed (stub)' })
})

export default router
