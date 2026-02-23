import express from 'express'
import authRoutes from './auth.routes.js'
import usersRoutes from './users.routes.js'
import artworksRoutes from './artworks.routes.js'
import exhibitionsRoutes from './exhibitions.routes.js'
import commerceRoutes from './commerce.routes.js'
import analyticsRoutes from './analytics.routes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/users', usersRoutes)
router.use('/artworks', artworksRoutes)
router.use('/exhibitions', exhibitionsRoutes)
router.use('/', commerceRoutes)
router.use('/analytics', analyticsRoutes)

export default router
