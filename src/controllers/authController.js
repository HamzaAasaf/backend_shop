const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'secret'
const _jwtExpireRaw = process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || '1d'
let JWT_EXPIRES_IN
if (/^\d+$/.test(_jwtExpireRaw)) {
  JWT_EXPIRES_IN = parseInt(_jwtExpireRaw, 10)
} else {
  JWT_EXPIRES_IN = _jwtExpireRaw
}

// Register a new user
async function register(req, res) {
  const { name, email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'الرجاء تقديم بريد إلكتروني وكلمة مرور' })
  }
  try {
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'المستخدم موجود بالفعل' })
    }
    const hash = await bcrypt.hash(password, 10)
    const user = new User({ name, email, passwordHash: hash })
    await user.save()
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    return res.status(201).json({ userId: user._id, email: user.email, token })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

// Login an existing user
async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'الرجاء تقديم بريد إلكتروني وكلمة مرور' })
  }
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'اعتماديات غير صحيحة' })
    }
    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) {
      return res.status(400).json({ message: 'اعتماديات غير صحيحة' })
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

module.exports = {
  register,
  login,
}
