const User = require('../models/User')
const Admin = require('../models/Admin')
const bcrypt = require('bcrypt')

// Get all users (admin view)
async function getAllUsers(req, res) {
  try {
    const users = await User.find({}).select('-passwordHash')
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

// Ban or unban a user
async function banUser(req, res) {
  const { id } = req.params
  const { ban } = req.body
  try {
    const user = await User.findById(id)
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' })
    user.banned = Boolean(ban)
    await user.save()
    res.json({ id: user._id, banned: user.banned })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

// Change admin password (now uses Admin model)
async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body
  const adminId = req.user._id

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'يرجى إدخال كلمة المرور الحالية والجديدة' })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' })
  }

  try {
    const admin = await Admin.findById(adminId)
    if (!admin) {
      return res.status(404).json({ message: 'المشرف غير موجود' })
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash)
    if (!isMatch) {
      return res.status(400).json({ message: 'كلمة المرور الحالية غير صحيحة' })
    }

    // Hash and save new password
    const newHash = await bcrypt.hash(newPassword, 10)
    admin.passwordHash = newHash
    await admin.save()

    res.json({ message: 'تم تغيير كلمة المرور بنجاح' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

module.exports = {
  getAllUsers,
  banUser,
  changePassword,
}
