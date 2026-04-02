function adminMiddleware(req, res, next) {
  // Check if user is admin type (from authMiddleware)
  if (req.userType !== 'admin' || !req.user) {
    return res.status(403).json({ message: 'مسموح للمشرف فقط' })
  }
  next()
}

module.exports = adminMiddleware
