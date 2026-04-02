const express = require('express')
const auth = require('../middleware/authMiddleware')
const { createOrder, getOrders, getOrderById } = require('../controllers/orderController')
const router = express.Router()

router.post('/orders', auth, createOrder)
router.get('/orders', auth, getOrders)
router.get('/orders/:id', auth, getOrderById)

module.exports = router
