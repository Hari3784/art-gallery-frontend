import express from 'express'
import cors from 'cors'
import routes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/v1', routes)
app.use(notFoundHandler)
app.use(errorHandler)

export default app
