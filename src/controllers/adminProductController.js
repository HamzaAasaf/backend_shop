const Product = require('../models/Product')
const Category = require('../models/Category')

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
  if (!category) {
    return res.status(400).json({ message: 'الرجاء اختيار تصنيف للمنتج' })
  }

  // Verify category exists
  try {
    const categoryExists = await Category.findById(category)
    if (!categoryExists) {
      return res.status(400).json({ message: 'التصنيف المختار غير موجود' })
    }

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

    // Populate category for response
    await product.populate('category')
    res.status(201).json(product)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

async function updateProduct(req, res) {
  const { id } = req.params
  const update = req.body

  // If category is being updated, verify it exists
  if (update.category) {
    try {
      const categoryExists = await Category.findById(update.category)
      if (!categoryExists) {
        return res.status(400).json({ message: 'التصنيف المختار غير موجود' })
      }
    } catch (err) {
      return res.status(400).json({ message: 'معرف التصنيف غير صالح' })
    }
  }

  try {
    const product = await Product.findByIdAndUpdate(id, update, { new: true }).populate('category')
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

// Get all products (admin view) with populated categories
async function getAllProducts(req, res) {
  try {
    const products = await Product.find({}).populate('category', 'name icon')
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
