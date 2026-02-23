import express from 'express'
import { pool } from '../config/db.js'
import { authenticate, requireRoles } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = express.Router()

router.use(authenticate, requireRoles('ADMIN'))

router.get(
  '/overview',
  asyncHandler(async (req, res) => {
    const [[users]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users WHERE is_active = TRUE')
    const [[approved]] = await pool.query("SELECT COUNT(*) AS approvedArtworks FROM artworks WHERE status = 'APPROVED'")
    const [[pending]] = await pool.query("SELECT COUNT(*) AS pendingArtworks FROM artworks WHERE status = 'PENDING'")
    const [[sales]] = await pool.query("SELECT COUNT(*) AS totalSales FROM orders WHERE status = 'PAID'")
    const [[revenue]] = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) AS totalRevenue FROM orders WHERE status = 'PAID'",
    )

    return res.json({
      totalUsers: users.totalUsers,
      approvedArtworks: approved.approvedArtworks,
      pendingArtworks: pending.pendingArtworks,
      totalSales: sales.totalSales,
      totalRevenue: Number(revenue.totalRevenue),
    })
  }),
)

router.get(
  '/transactions',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query(
      `SELECT
         oi.id AS id,
         o.id AS order_id,
         o.status,
         o.currency,
         oi.unit_price AS total_amount,
         o.payment_method,
         o.created_at,
         u.name AS buyer_name,
         a.title AS artwork_title
       FROM order_items oi
       INNER JOIN orders o ON o.id = oi.order_id
       INNER JOIN users u ON u.id = o.visitor_id
       INNER JOIN artworks a ON a.id = oi.artwork_id
       WHERE o.status = 'PAID'
       ORDER BY o.created_at DESC, oi.id DESC`,
    )

    return res.json(rows)
  }),
)

export default router
