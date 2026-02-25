import express from 'express'
import artworksRoutes from './artworks.routes.js'

const router = express.Router()

router.use('/artworks', artworksRoutes)

export default router
