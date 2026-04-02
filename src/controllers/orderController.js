const Product = require('../models/Product')
const Order = require('../models/Order')

// Create a new order for the authenticated user
async function createOrder(req, res) {
  const user = req.user
  const { items } = req.body
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'الرجاء توفير عناصر الطلب' })
  }
  try {
    // Build order items and compute total
    const detailedItems = []
    let total = 0
    for (const it of items) {
      const product = await Product.findById(it.productId)
      if (!product) return res.status(400).json({ message: 'عنصر المنتج غير موجود' })
      const priceAtPurchase = product.price
      const quantity = Number(it.quantity) || 1
      detailedItems.push({ productId: product._id, quantity, priceAtPurchase })
      total += priceAtPurchase * quantity
    }
    const order = new Order({ user: user._id, items: detailedItems, total, status: 'pending' })
    await order.save()
    res.status(201).json({ orderId: order._id, status: order.status, total: order.total, createdAt: order.createdAt })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

// Get all orders for the authenticated user
async function getOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

// Get a single order by id for authenticated user
async function getOrderById(req, res) {
  const { id } = req.params
  try {
    const order = await Order.findById(id)
    if (!order) return res.status(404).json({ message: 'الطلب غير موجود' })
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'غير مسموح لك بالوصول إلى هذا الطلب' })
    }
    res.json(order)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
}
