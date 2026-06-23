const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')
const rateLimit = require('express-rate-limit')
const dotenv = require('dotenv')
const authRoutes = require('./routes/auth')
const chatRoutes = require('./routes/chat')
const userRoutes = require('./routes/user')

dotenv.config()

const app = express()
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

const PORT = process.env.PORT || 3002

// Basic rate limiter for API
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 })
app.use('/api/', limiter)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/user', userRoutes)

app.get('/', (req, res) => res.json({ ok: true, version: 'codex/012-backend-db' }))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
