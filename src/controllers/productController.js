const Product = require('../models/Product')

async function getAllProducts(req, res) {
  try {
    const products = await Product.find({})
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

async function getProductById(req, res) {
  const { id } = req.params
  try {
    const product = await Product.findById(id)
    if (!product) return res.status(404).json({ message: 'منتج غير موجود' })
    res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

module.exports = {
  getAllProducts,
  getProductById,
}
