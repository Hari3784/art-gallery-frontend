import express from 'express'
import { pool } from '../config/db.js'
import { authenticate, requireRoles } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = express.Router()

router.use(authenticate, requireRoles('VISITOR'))

router.get(
  '/wishlist',
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query(
      `SELECT a.*
       FROM wishlists w
       INNER JOIN artworks a ON a.id = w.artwork_id
       WHERE w.visitor_id = ?
       ORDER BY w.created_at DESC`,
      [req.user.id],
    )
    return res.json(rows)
  }),
)

router.post(
  '/wishlist/:artworkId',
  asyncHandler(async (req, res) => {
    await pool.query('INSERT IGNORE INTO wishlists (visitor_id, artwork_id) VALUES (?, ?)', [
      req.user.id,
      req.params.artworkId,
    ])
    return res.status(201).json({ message: 'Added to wishlist' })
  }),
)

router.delete(
  '/wishlist/:artworkId',
  asyncHandler(async (req, res) => {
    await pool.query('DELETE FROM wishlists WHERE visitor_id = ? AND artwork_id = ?', [
      req.user.id,
      req.params.artworkId,
    ])
    return res.json({ message: 'Removed from wishlist' })
  }),
)

async function getOrCreateCart(visitorId) {
  const [rows] = await pool.query('SELECT id FROM carts WHERE visitor_id = ?', [visitorId])
  if (rows.length) {
    return rows[0].id
  }

  const [result] = await pool.query('INSERT INTO carts (visitor_id) VALUES (?)', [visitorId])
  return result.insertId
}

router.get(
  '/cart',
  asyncHandler(async (req, res) => {
    const cartId = await getOrCreateCart(req.user.id)
    const [rows] = await pool.query(
      `SELECT ci.id AS cart_item_id, a.id AS artwork_id, a.title, a.price, a.image_url
       FROM cart_items ci
       INNER JOIN artworks a ON a.id = ci.artwork_id
       WHERE ci.cart_id = ?`,
      [cartId],
    )
    return res.json(rows)
  }),
)

router.post(
  '/cart/:artworkId',
  asyncHandler(async (req, res) => {
    const cartId = await getOrCreateCart(req.user.id)
    await pool.query('INSERT IGNORE INTO cart_items (cart_id, artwork_id) VALUES (?, ?)', [
      cartId,
      req.params.artworkId,
    ])
    return res.status(201).json({ message: 'Added to cart' })
  }),
)

router.delete(
  '/cart/:artworkId',
  asyncHandler(async (req, res) => {
    const cartId = await getOrCreateCart(req.user.id)
    await pool.query('DELETE FROM cart_items WHERE cart_id = ? AND artwork_id = ?', [
      cartId,
      req.params.artworkId,
    ])
    return res.json({ message: 'Removed from cart' })
  }),
)

router.post(
  '/checkout',
  asyncHandler(async (req, res) => {
    const {
      paymentMethod = 'UPI',
      currency = 'INR',
      purchaserName,
      mobile,
      address,
      landmark,
    } = req.body

    if (!purchaserName || !mobile || !address || !landmark) {
      return res.status(400).json({
        message: 'purchaserName, mobile, address, and landmark are required',
      })
    }

    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [cartRows] = await connection.query('SELECT id FROM carts WHERE visitor_id = ?', [req.user.id])
      if (!cartRows.length) {
        await connection.rollback()
        return res.status(400).json({ message: 'Cart is empty' })
      }

      const cartId = cartRows[0].id
      const [items] = await connection.query(
        `SELECT ci.artwork_id, a.artist_id, a.price
         FROM cart_items ci
         INNER JOIN artworks a ON a.id = ci.artwork_id
         WHERE ci.cart_id = ?`,
        [cartId],
      )

      if (!items.length) {
        await connection.rollback()
        return res.status(400).json({ message: 'Cart is empty' })
      }

      const totalAmount = items.reduce((sum, item) => sum + Number(item.price), 0)
      const [orderResult] = await connection.query(
        `INSERT INTO orders
         (visitor_id, status, currency, total_amount, payment_method, purchaser_name, mobile, address, landmark)
         VALUES (?, 'PAID', ?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, currency, totalAmount, paymentMethod, purchaserName, mobile, address, landmark],
      )

      const orderItemTuples = items.map((item) => [orderResult.insertId, item.artwork_id, item.artist_id, item.price])
      await connection.query(
        'INSERT INTO order_items (order_id, artwork_id, artist_id, unit_price) VALUES ?',
        [orderItemTuples],
      )

      await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId])
      await connection.commit()

      return res.status(201).json({
        orderId: orderResult.insertId,
        status: 'PAID',
        amount: totalAmount,
      })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }),
)

export default router
