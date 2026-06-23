require('dotenv').config()
const fs = require('fs')
const path = require('path')
const express = require('express')
const fetch = require('node-fetch')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const bodyParser = require('body-parser')

const app = express()
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

const PORT = process.env.PORT || 3002
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const DB_PATH = path.join(__dirname, 'db.json')

// Simple rate limiter
const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 })
app.use('/api/', limiter)

function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8')
    return JSON.parse(raw)
  } catch (e) {
    return { user: { id: 1, zones: ['UTC'], hour12: false, locale: 'en-US' }, chats: [] }
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8')
}

// User settings endpoints (simple)
app.get('/api/user/1', (req, res) => {
  const db = readDB()
  return res.json(db.user)
})

app.patch('/api/user/1', (req, res) => {
  const db = readDB()
  const body = req.body
  db.user = Object.assign(db.user || {}, body)
  writeDB(db)
  return res.json(db.user)
})

// Chat proxy endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'gpt-4' } = req.body
    if (!Array.isArray(messages)) return res.status(400).json({ error: 'messages must be array' })
    if (!OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY not configured on server' })

    // Basic validation
    if (messages.length > 60) return res.status(400).json({ error: 'too many messages' })

    const payload = {
      model,
      messages,
      max_tokens: 800,
      temperature: 0.7
    }

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!r.ok) {
      const text = await r.text()
      return res.status(502).json({ error: 'OpenAI error', detail: text })
    }

    const data = await r.json()

    // Optionally persist chat snippet to db.json
    try {
      const db = readDB()
      db.chats = db.chats || []
      db.chats.push({ id: db.chats.length + 1, messages: messages.slice(-10), response: data.choices?.[0]?.message, createdAt: new Date().toISOString() })
      writeDB(db)
    } catch (e) {
      console.warn('Could not persist chat to db:', e.message)
    }

    return res.json(data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server_error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server (chat proxy) listening on port ${PORT}`)
})
