const express = require('express')
const router = express.Router()
const prisma = require('../prisma')
const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// simple auth middleware to attach user if token provided
async function tryAttachUser(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return next()
  const parts = auth.split(' ')
  if (parts.length !== 2) return next()
  const token = parts[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
    if (user) req.user = user
  } catch (e) {
    // ignore invalid token
  }
  return next()
}

router.use(tryAttachUser)

router.post('/', async (req, res) => {
  try {
    const { messages, model = 'gpt-4' } = req.body
    if (!Array.isArray(messages)) return res.status(400).json({ error: 'messages must be array' })
    if (!OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' })
    if (messages.length > 80) return res.status(400).json({ error: 'too many messages' })

    const payload = { model, messages, max_tokens: 800, temperature: 0.7 }

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!r.ok) {
      const text = await r.text()
      return res.status(502).json({ error: 'OpenAI error', detail: text })
    }

    const data = await r.json()

    // persist chat and messages if user is present
    try {
      if (req.user) {
        const chat = await prisma.chat.create({ data: { userId: req.user.id, title: messages[0]?.content?.slice(0, 120) || 'Chat' } })
        const assistantMsg = data?.choices?.[0]?.message
        await prisma.chatMessage.createMany({ data: [
          ...messages.map(m => ({ chatId: chat.id, role: m.role, content: m.content })),
          { chatId: chat.id, role: assistantMsg?.role || 'assistant', content: assistantMsg?.content || JSON.stringify(assistantMsg) }
        ]})
      }
    } catch (e) {
      console.warn('DB persist failed', e.message)
    }

    return res.json(data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server_error' })
  }
})

module.exports = router
