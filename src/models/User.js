const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['customer'], default: 'customer' },
    banned: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
