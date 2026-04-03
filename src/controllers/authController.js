const User = require('../models/User')
const Admin = require('../models/Admin')
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

// Register a new user (customers only)
async function register(req, res) {
  const { name, email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'الرجاء تقديم بريد إلكتروني وكلمة مرور' })
  }
  try {
    // Check if email exists in either collection
    const existingUser = await User.findOne({ email })
    const existingAdmin = await Admin.findOne({ email })
    if (existingUser || existingAdmin) {
      return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' })
    }
    const hash = await bcrypt.hash(password, 10)
    const user = new User({ name, email, passwordHash: hash, role: 'customer' })
    await user.save()
    const token = jwt.sign({ userId: user._id, role: 'customer' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    return res.status(201).json({ userId: user._id, email: user.email, role: 'customer', token })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

// Login - checks both Admin and User collections
async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'الرجاء تقديم بريد إلكتروني وكلمة مرور' })
  }
  try {
    // First check Admin collection
    let admin = await Admin.findOne({ email })
    if (admin) {
      const match = await bcrypt.compare(password, admin.passwordHash)
      if (!match) {
        return res.status(400).json({ message: 'اعتماديات غير صحيحة' })
      }
      if (!admin.isActive) {
        return res.status(400).json({ message: 'الحساب غير نشط' })
      }

      // Update last login
      admin.lastLogin = new Date()
      await admin.save()

      const token = jwt.sign({ userId: admin._id, role: admin.role, type: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
      return res.json({
        token,
        user: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          type: 'admin'
        }
      })
    }

    // Then check User collection
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'اعتماديات غير صحيحة' })
    }
    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) {
      return res.status(400).json({ message: 'اعتماديات غير صحيحة' })
    }
    const token = jwt.sign({ userId: user._id, role: user.role || 'customer' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || 'customer',
        type: 'customer'
      }
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

module.exports = {
  register,
  login,
}
