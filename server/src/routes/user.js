const express = require('express')
const router = express.Router()
const prisma = require('../prisma')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

// middleware to require auth
function requireAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'auth required' })
  const parts = auth.split(' ')
  if (parts.length !== 2) return res.status(401).json({ error: 'invalid auth' })
  const token = parts[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    return next()
  } catch (e) {
    return res.status(401).json({ error: 'invalid token' })
  }
}

// GET /api/user/1 -> return current user's settings if auth, otherwise return default demo user
router.get('/1', async (req, res) => {
  const auth = req.headers.authorization
  if (!auth) {
    // return demo
    const demo = await prisma.user.findUnique({ where: { id: 1 } }).catch(() => null)
    if (demo) {
      const settings = await prisma.userSettings.findUnique({ where: { userId: demo.id } }).catch(() => null)
      return res.json(Object.assign({ id: demo.id, email: demo.email, name: demo.name }, settings ? { settings } : {}))
    }
    return res.json({ id: 1, zones: ['UTC'], hour12: false, locale: 'en-US' })
  }

  // If auth provided, get authenticated user's settings
  try {
    const parts = auth.split(' ')
    const token = parts[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
    if (!user) return res.status(404).json({ error: 'user not found' })
    const settings = await prisma.userSettings.findUnique({ where: { userId: user.id } })
    return res.json({ id: user.id, email: user.email, name: user.name, settings })
  } catch (e) {
    return res.status(401).json({ error: 'invalid token' })
  }
})

// PATCH /api/user/1 -> update settings (requires auth)
router.patch('/1', requireAuth, async (req, res) => {
  try {
    const { zones, hour12, locale } = req.body
    let settings = await prisma.userSettings.findUnique({ where: { userId: req.userId } })
    if (!settings) {
      settings = await prisma.userSettings.create({ data: { userId: req.userId, zones: zones || [], hour12: !!hour12, locale: locale || 'en-US' } })
    } else {
      settings = await prisma.userSettings.update({ where: { id: settings.id }, data: { zones: zones || settings.zones, hour12: hour12 !== undefined ? hour12 : settings.hour12, locale: locale || settings.locale } })
    }
    return res.json(settings)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'server_error' })
  }
})

module.exports = router
