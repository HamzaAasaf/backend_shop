const Cart = require('../models/Cart')
const Product = require('../models/Product')
const Order = require('../models/Order')

// Get current cart for the user
async function getCart(req, res) {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.productId')
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
      await cart.save()
    }
    res.json(cart)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

// Add item to cart
async function addToCart(req, res) {
  const { productId, quantity } = req.body
  if (!productId) return res.status(400).json({ message: 'تحديد معرف المنتج مطلوب' })
  const qty = Math.max(1, Number(quantity) || 1)
  try {
    const product = await Product.findById(productId)
    if (!product) return res.status(400).json({ message: 'المنتج غير موجود' })
    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
    }
    const index = cart.items.findIndex(i => i.productId.toString() === productId)
    if (index >= 0) {
      cart.items[index].quantity += qty
    } else {
      cart.items.push({ productId, quantity: qty })
    }
    await cart.save()
    res.json(cart)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

// Clear cart items
async function clearCart(req, res) {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (cart) {
      cart.items = []
      await cart.save()
    }
    res.json({ message: 'تم إفراغ السلة' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

// Checkout: convert cart to order
async function checkoutFromCart(req, res) {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'السلة فارغة' })
    }
    const detailedItems = []
    let total = 0
    for (const it of cart.items) {
      const product = await Product.findById(it.productId)
      if (!product) return res.status(400).json({ message: 'عنصر منتج غير موجود' })
      const priceAtPurchase = product.price
      detailedItems.push({ productId: product._id, quantity: it.quantity, priceAtPurchase })
      total += priceAtPurchase * it.quantity
    }
    const order = new Order({ user: req.user._id, items: detailedItems, total, status: 'pending' })
    await order.save()
    cart.items = []
    await cart.save()
    res.status(201).json({ orderId: order._id, status: order.status, total: order.total })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

module.exports = {
  getCart,
  addToCart,
  clearCart,
  checkoutFromCart,
}
