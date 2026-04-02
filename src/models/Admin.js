const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'المشرف' },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'admin', enum: ['admin', 'superadmin'] },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
)

// Virtual for id
adminSchema.virtual('id').get(function() {
  return this._id.toString()
})
adminSchema.set('toJSON', { virtuals: true })
adminSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Admin', adminSchema)
