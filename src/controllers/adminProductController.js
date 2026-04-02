const Product = require('../models/Product')

async function createProduct(req, res) {
  const {
    title,
    description,
    price,
    stock,
    category,
    imageUrls,
    variations,
    details
  } = req.body
  if (!title || typeof price !== 'number') {
    return res.status(400).json({ message: 'الرجاء تقديم العنوان والسعر' })
  }
  try {
    const product = new Product({
      title,
      description,
      price,
      stock,
      category,
      imageUrls,
      variations,
      details
    })
    await product.save()
    res.status(201).json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

async function updateProduct(req, res) {
  const { id } = req.params
  const update = req.body
  try {
    const product = await Product.findByIdAndUpdate(id, update, { new: true })
    if (!product) return res.status(404).json({ message: 'منتج غير موجود' })
    res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params
  try {
    const product = await Product.findByIdAndDelete(id)
    if (!product) return res.status(404).json({ message: 'منتج غير موجود' })
    res.json({ message: 'تم حذف المنتج' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

// Get all products (admin view)
async function getAllProducts(req, res) {
  try {
    const products = await require('../models/Product').find({})
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
}
