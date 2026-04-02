const User = require('../models/User')

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

module.exports = {
  getAllUsers,
  banUser,
}
