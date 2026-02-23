import express from 'express'
import { pool } from '../config/db.js'
import { authenticate, requireRoles } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = express.Router()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query(
      `SELECT e.*, u.name AS curator_name, COUNT(ea.id) AS artwork_count
       FROM exhibitions e
       INNER JOIN users u ON u.id = e.curator_id
       LEFT JOIN exhibition_artworks ea ON ea.exhibition_id = e.id
       GROUP BY e.id
       ORDER BY e.created_at DESC`,
    )

    return res.json(rows)
  }),
)

router.post(
  '/',
  authenticate,
  requireRoles('CURATOR', 'ADMIN'),
  asyncHandler(async (req, res) => {
    const { title, theme, culture, commentary, virtualTourLabel, featured, artworkIds = [] } = req.body

    if (!title || !theme) {
      return res.status(400).json({ message: 'title and theme are required' })
    }

    const [result] = await pool.query(
      `INSERT INTO exhibitions
       (curator_id, title, theme, culture_focus, commentary, virtual_tour_label, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        title,
        theme,
        culture || null,
        commentary || null,
        virtualTourLabel || null,
        Boolean(featured),
      ],
    )

    if (Array.isArray(artworkIds) && artworkIds.length) {
      const tuples = artworkIds.map((artworkId) => [result.insertId, artworkId])
      await pool.query('INSERT INTO exhibition_artworks (exhibition_id, artwork_id) VALUES ?', [tuples])
    }

    return res.status(201).json({ id: result.insertId, message: 'Exhibition created' })
  }),
)

export default router
