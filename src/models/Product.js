const mongoose = require('mongoose')

// Variation schema for product variants (color, size, etc.)
const variationSchema = new mongoose.Schema(
  {
    color: { type: String },
    size: { type: String },
    dimensions: { type: String }, // e.g., "10x20 cm"
    weight: { type: Number }, // وزن المنتج للنسخ المختلفة
    stock: { type: Number, default: 0 },
    price: { type: Number }, // إذا وجدت اختلاف سعر حسب الفئة
  },
  { _id: true }
)

// Detail key-value pair for additional product information
const detailSchema = new mongoose.Schema(
  {
    key: { type: String },
    value: { type: String }
  },
  { _id: false }
)

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: { type: String },
    imageUrls: { type: [String], default: [] },
    variations: { type: [variationSchema], default: [] },
    details: { type: [detailSchema], default: [] },
  },
  { timestamps: true }
)

// Expose 'id' as alias of _id in JSON responses
productSchema.virtual('id').get(function() {
  return this._id.toString()
})
productSchema.set('toJSON', { virtuals: true })
productSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Product', productSchema)
