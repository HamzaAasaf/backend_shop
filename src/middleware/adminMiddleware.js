function adminMiddleware(req, res, next) {
  const user = req.user
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'مسموح للمشرف فقط' })
  }
  next()
}

module.exports = adminMiddleware
