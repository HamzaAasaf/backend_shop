const Category = require('../models/Category')

// Get all categories
async function getCategories(req, res) {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 })
    res.json(categories)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

// Get all categories (admin view - includes inactive)
async function getAllCategories(req, res) {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 })
    res.json(categories)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

// Get single category by ID
async function getCategoryById(req, res) {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ message: 'التصنيف غير موجود' })
    }
    res.json(category)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

// Create new category
async function createCategory(req, res) {
  const { name, description, icon, parentCategory, sortOrder } = req.body

  if (!name) {
    return res.status(400).json({ message: 'اسم التصنيف مطلوب' })
  }

  try {
    // Check if category name already exists
    const existing = await Category.findOne({ name })
    if (existing) {
      return res.status(400).json({ message: 'اسم التصنيف مستخدم بالفعل' })
    }

    const category = await Category.create({
      name,
      description: description || '',
      icon: icon || '',
      parentCategory: parentCategory || null,
      sortOrder: sortOrder || 0,
      isActive: true
    })

    res.status(201).json(category)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

// Update category
async function updateCategory(req, res) {
  const { id } = req.params
  const { name, description, icon, parentCategory, sortOrder, isActive } = req.body

  try {
    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ message: 'التصنيف غير موجود' })
    }

    // Check if new name conflicts with another category
    if (name && name !== category.name) {
      const existing = await Category.findOne({ name })
      if (existing) {
        return res.status(400).json({ message: 'اسم التصنيف مستخدم بالفعل' })
      }
      category.name = name
    }

    if (description !== undefined) category.description = description
    if (icon !== undefined) category.icon = icon
    if (parentCategory !== undefined) category.parentCategory = parentCategory || null
    if (sortOrder !== undefined) category.sortOrder = sortOrder
    if (isActive !== undefined) category.isActive = isActive

    await category.save()
    res.json(category)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

// Delete category
async function deleteCategory(req, res) {
  const { id } = req.params

  try {
    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ message: 'التصنيف غير موجود' })
    }

    // Check if category has products
    const Product = require('../models/Product')
    const productsCount = await Product.countDocuments({ category: id })
    if (productsCount > 0) {
      return res.status(400).json({ 
        message: `لا يمكن حذف التصنيف لأنه يحتوي على ${productsCount} منتج. يرجى نقل المنتجات إلى تصنيف آخر أولاً.` 
      })
    }

    await Category.findByIdAndDelete(id)
    res.json({ message: 'تم حذف التصنيف بنجاح' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

module.exports = {
  getCategories,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
}
