const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Admin = require('../models/Admin')

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'توثيق مطلوب' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)

    // Check if it's an admin token
    if (payload.type === 'admin') {
      const admin = await Admin.findById(payload.userId)
      if (!admin) return res.status(401).json({ message: 'المشرف غير موجود' })
      if (!admin.isActive) return res.status(401).json({ message: 'الحساب غير نشط' })
      req.user = admin
      req.userType = 'admin'
      next()
      return
    }

    // Otherwise check User collection
    const user = await User.findById(payload.userId)
    if (!user) return res.status(401).json({ message: 'المستخدم غير موجود' })
    req.user = user
    req.userType = 'customer'
    next()
  } catch (err) {
    return res.status(401).json({ message: 'توثيق غير صحيح' })
  }
}

module.exports = authMiddleware
