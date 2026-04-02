const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  type: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
  minPurchase: { type: Number, default: 0 },
  expiresAt: { type: Date },
  active: { type: Boolean, default: true },
  usageCount: { type: Number, default: 0 },
  maxUsage: { type: Number, default: 1000 }
}, { timestamps: true })

module.exports = mongoose.model('Coupon', couponSchema)
