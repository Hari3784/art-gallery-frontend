import express from 'express'
import { pool } from '../config/db.js'
import { authenticate, requireRoles } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = express.Router()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { search, culture, category, artistId, maxPrice, status } = req.query
    const where = []
    const params = []

    if (status) {
      where.push('a.status = ?')
      params.push(status)
    } else {
      where.push("a.status = 'APPROVED'")
    }

    if (search) {
      where.push('(a.title LIKE ? OR a.description LIKE ? OR u.name LIKE ?)')
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (culture) {
      where.push('a.culture = ?')
      params.push(culture)
    }

    if (category) {
      where.push('a.category = ?')
      params.push(category)
    }

    if (artistId) {
      where.push('a.artist_id = ?')
      params.push(artistId)
    }

    if (maxPrice) {
      where.push('a.price <= ?')
      params.push(maxPrice)
    }

    const sql = `
      SELECT a.*, u.name AS artist_name,
             COALESCE(AVG(ar.rating), 0) AS rating,
             COUNT(ar.id) AS review_count
      FROM artworks a
      INNER JOIN users u ON u.id = a.artist_id
      LEFT JOIN artwork_reviews ar ON ar.artwork_id = a.id
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `

    const [rows] = await pool.query(sql, params)
    return res.json(rows)
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query(
      `SELECT a.*, u.name AS artist_name,
              COALESCE(AVG(ar.rating), 0) AS rating,
              COUNT(ar.id) AS review_count
       FROM artworks a
       INNER JOIN users u ON u.id = a.artist_id
       LEFT JOIN artwork_reviews ar ON ar.artwork_id = a.id
       WHERE a.id = ?
       GROUP BY a.id`,
      [req.params.id],
    )

    if (!rows.length) {
      return res.status(404).json({ message: 'Artwork not found' })
    }

    return res.json(rows[0])
  }),
)

router.post(
  '/',
  authenticate,
  requireRoles('ARTIST'),
  asyncHandler(async (req, res) => {
    const {
      title,
      description,
      culturalInfo,
      historicalInfo,
      culture,
      period,
      category,
      price,
      imageUrl,
    } = req.body

    if (!title || !category || !price) {
      return res.status(400).json({ message: 'title, category, and price are required' })
    }

    const [result] = await pool.query(
      `INSERT INTO artworks
       (artist_id, title, description, cultural_info, historical_info, culture, period_label, category, price, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
      [
        req.user.id,
        title,
        description || null,
        culturalInfo || null,
        historicalInfo || null,
        culture || null,
        period || null,
        category,
        price,
        imageUrl || null,
      ],
    )

    return res.status(201).json({ id: result.insertId, message: 'Artwork created and pending approval' })
  }),
)

router.patch(
  '/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const [found] = await pool.query('SELECT id, artist_id FROM artworks WHERE id = ?', [id])
    if (!found.length) {
      return res.status(404).json({ message: 'Artwork not found' })
    }

    const isAdmin = req.user.role === 'ADMIN'
    const isOwner = Number(found[0].artist_id) === Number(req.user.id)
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'You cannot edit this artwork' })
    }

    const fields = [
      ['title', 'title'],
      ['description', 'description'],
      ['culturalInfo', 'cultural_info'],
      ['historicalInfo', 'historical_info'],
      ['culture', 'culture'],
      ['period', 'period_label'],
      ['category', 'category'],
      ['price', 'price'],
      ['imageUrl', 'image_url'],
      ['featured', 'featured'],
    ]

    const updates = []
    const values = []

    for (const [bodyKey, column] of fields) {
      if (req.body[bodyKey] !== undefined) {
        updates.push(`${column} = ?`)
        values.push(req.body[bodyKey])
      }
    }

    if (!updates.length) {
      return res.status(400).json({ message: 'No updatable fields provided' })
    }

    values.push(id)
    await pool.query(`UPDATE artworks SET ${updates.join(', ')} WHERE id = ?`, values)
    return res.json({ message: 'Artwork updated' })
  }),
)

router.patch(
  '/:id/status',
  authenticate,
  requireRoles('ADMIN'),
  asyncHandler(async (req, res) => {
    const { status, moderationNote } = req.body
    if (!status) {
      return res.status(400).json({ message: 'status is required' })
    }

    const [result] = await pool.query('UPDATE artworks SET status = ?, moderation_note = ? WHERE id = ?', [
      status,
      moderationNote || null,
      req.params.id,
    ])

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Artwork not found' })
    }

    return res.json({ message: 'Artwork moderation status updated' })
  }),
)

router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const [found] = await pool.query('SELECT id, artist_id FROM artworks WHERE id = ?', [req.params.id])
    if (!found.length) {
      return res.status(404).json({ message: 'Artwork not found' })
    }

    const isAdmin = req.user.role === 'ADMIN'
    const isOwner = Number(found[0].artist_id) === Number(req.user.id)
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'You cannot delete this artwork' })
    }

    await pool.query('DELETE FROM artworks WHERE id = ?', [req.params.id])
    return res.json({ message: 'Artwork deleted' })
  }),
)

export default router
