const express = require('express')
const auth = require('../middleware/authMiddleware')
const { getCart, addToCart, clearCart, checkoutFromCart } = require('../controllers/cartController')
const router = express.Router()

router.get('/cart', auth, getCart)
router.post('/cart/add', auth, addToCart)
router.post('/cart/checkout', auth, checkoutFromCart)
router.post('/cart/clear', auth, clearCart)

module.exports = router
