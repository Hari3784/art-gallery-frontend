import express from 'express'
import { pool } from '../config/db.js'
import { authenticate, requireRoles } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = express.Router()

router.use(authenticate, requireRoles('ADMIN'))

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, r.name AS role, u.is_active, u.created_at
       FROM users u
       INNER JOIN roles r ON r.id = u.role_id
       ORDER BY u.created_at DESC`,
    )

    return res.json(rows)
  }),
)

router.patch(
  '/:id/role',
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const { role } = req.body

    if (!role) {
      return res.status(400).json({ message: 'role is required' })
    }

    const [roleRows] = await pool.query('SELECT id FROM roles WHERE name = ?', [role])
    if (!roleRows.length) {
      return res.status(400).json({ message: 'Invalid role value' })
    }

    const [result] = await pool.query('UPDATE users SET role_id = ? WHERE id = ?', [roleRows[0].id, id])
    if (!result.affectedRows) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ message: 'User role updated' })
  }),
)

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const [result] = await pool.query('UPDATE users SET is_active = FALSE WHERE id = ?', [id])

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ message: 'User deactivated' })
  }),
)

export default router
