const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'توثيق مطلوب' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(payload.userId)
    if (!user) return res.status(401).json({ message: 'المستخدم غير موجود' })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'توثيق غير صحيح' })
  }
}

module.exports = authMiddleware
