// Database reset script - deletes all data from all collections
require('dotenv').config()
const connectDB = require('./config/db')
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI

const User = require('./models/User')
const Admin = require('./models/Admin')
const Product = require('./models/Product')
const Category = require('./models/Category')
const Order = require('./models/Order')
const Cart = require('./models/Cart')
const Coupon = require('./models/Coupon')

async function resetDatabase() {
  console.log('Starting database reset...')

  await User.deleteMany({})
  console.log('✓ Deleted all users (customers)')

  await Admin.deleteMany({})
  console.log('✓ Deleted all admins')

  await Product.deleteMany({})
  console.log('✓ Deleted all products')

  await Category.deleteMany({})
  console.log('✓ Deleted all categories')

  await Order.deleteMany({})
  console.log('✓ Deleted all orders')

  await Cart.deleteMany({})
  console.log('✓ Deleted all carts')

  await Coupon.deleteMany({})
  console.log('✓ Deleted all coupons')

  console.log('\nDatabase reset complete!')
}

async function run() {
  if (!mongoURI) {
    console.error('MongoDB URI not available in environment variables')
    process.exit(1)
  }
  try {
    await connectDB(mongoURI)
    await resetDatabase()
    process.exit(0)
  } catch (err) {
    console.error('Database reset failed:', err)
    process.exit(1)
  }
}

run().catch(err => {
  console.error('Reset error:', err)
  process.exit(1)
})
