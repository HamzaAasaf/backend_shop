const Order = require('../models/Order')

async function getAllOrders(req, res) {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'name email').populate('items.productId')
    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

async function getOrderById(req, res) {
  const { id } = req.params
  try {
    const order = await Order.findById(id).populate('user', 'name email').populate('items.productId')
    if (!order) return res.status(404).json({ message: 'الطلب غير موجود' })
    res.json(order)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

async function updateOrder(req, res) {
  const { id } = req.params
  const { status } = req.body
  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
    if (!order) return res.status(404).json({ message: 'الطلب غير موجود' })
    res.json(order)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrder,
}
