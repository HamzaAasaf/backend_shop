const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

categorySchema.virtual('id').get(function() {
  return this._id.toString()
})
categorySchema.set('toJSON', { virtuals: true })
categorySchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Category', categorySchema)
