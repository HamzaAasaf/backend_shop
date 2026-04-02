const User = require('../models/User')
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
=======
const Admin = require('../models/Admin')
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
const Admin = require('../models/Admin')
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
const Admin = require('../models/Admin')
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
const Admin = require('../models/Admin')
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
const Admin = require('../models/Admin')
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
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

<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
// Change admin password
async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body
  const userId = req.user._id
=======
=======
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
// Change admin password (now uses Admin model)
async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body
  const adminId = req.user._id
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'يرجى إدخال كلمة المرور الحالية والجديدة' })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' })
  }

  try {
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' })
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)
=======
=======
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
    const admin = await Admin.findById(adminId)
    if (!admin) {
      return res.status(404).json({ message: 'المشرف غير موجود' })
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash)
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
    if (!isMatch) {
      return res.status(400).json({ message: 'كلمة المرور الحالية غير صحيحة' })
    }

    // Hash and save new password
    const newHash = await bcrypt.hash(newPassword, 10)
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
<<<<<<< C:/Users/Hamza/Desktop/backend_shop/src/controllers/adminUserController.js
    user.passwordHash = newHash
    await user.save()
=======
    admin.passwordHash = newHash
    await admin.save()
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
    admin.passwordHash = newHash
    await admin.save()
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
    admin.passwordHash = newHash
    await admin.save()
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
    admin.passwordHash = newHash
    await admin.save()
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js
=======
    admin.passwordHash = newHash
    await admin.save()
>>>>>>> C:/Users/Hamza/.windsurf/worktrees/backend_shop/backend_shop-ab27899e/src/controllers/adminUserController.js

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
