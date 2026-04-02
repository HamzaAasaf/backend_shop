const express = require('express')
const auth = require('../middleware/authMiddleware')
const admin = require('../middleware/adminMiddleware')

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts: adminGetAllProducts
} = require('../controllers/adminProductController')
const {
  getAllOrders,
  getOrderById,
  updateOrder
} = require('../controllers/adminOrderController')
const { getAllUsers, banUser } = require('../controllers/adminUserController')
const couponCtrl = require('../controllers/adminCouponController')
const analyticsCtrl = require('../controllers/adminAnalyticsController')
const settingsCtrl = require('../controllers/adminSettingsController')

const router = express.Router()

// Product management
router.get('/admin/products', auth, admin, adminGetAllProducts)
router.post('/admin/products', auth, admin, createProduct)
router.put('/admin/products/:id', auth, admin, updateProduct)
router.delete('/admin/products/:id', auth, admin, deleteProduct)

// Order management
router.get('/admin/orders', auth, admin, getAllOrders)
router.get('/admin/orders/:id', auth, admin, getOrderById)
router.patch('/admin/orders/:id', auth, admin, updateOrder)

// User management
router.get('/admin/users', auth, admin, getAllUsers)
router.patch('/admin/users/:id/ban', auth, admin, banUser)

// Coupons
router.get('/admin/coupons', auth, admin, couponCtrl.getCoupons)
router.post('/admin/coupons', auth, admin, couponCtrl.createCoupon)
router.get('/admin/coupons/code/:code', auth, admin, couponCtrl.getCouponByCode)
router.get('/admin/coupons/:id', auth, admin, couponCtrl.getCouponById)
router.put('/admin/coupons/:id', auth, admin, couponCtrl.updateCoupon)
router.delete('/admin/coupons/:id', auth, admin, couponCtrl.deleteCoupon)

// Analytics & Settings
router.get('/admin/analytics', auth, admin, analyticsCtrl.getAnalytics)
router.get('/admin/settings', auth, admin, settingsCtrl.getSettings)
router.put('/admin/settings', auth, admin, settingsCtrl.updateSettings)

module.exports = router
