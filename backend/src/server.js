import app from './app.js'
import { env } from './config/env.js'
import { testDbConnection } from './config/db.js'

async function bootstrap() {
  try {
    await testDbConnection()
    app.listen(env.port, () => {
      console.log(`Backend running on http://localhost:${env.port}`)
    })
  } catch (error) {
    console.error('Failed to start backend:', error.message)
    process.exit(1)
  }
}

bootstrap()
