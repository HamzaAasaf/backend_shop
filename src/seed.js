// Seed script with DB connection handling
require('dotenv').config()
const connectDB = require('./config/db')
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI
const User = require('./models/User')
const Product = require('./models/Product')
const bcrypt = require('bcrypt')

async function seed() {
  // Ensure a dedicated admin user exists with the provided credentials
  const adminEmail = 'hamza@hamza.com'
  const adminPassword = 'hamza9090'
  const hash = await bcrypt.hash(adminPassword, 10)
  let admin = await User.findOne({ email: adminEmail, role: 'admin' })
  if (!admin) {
    admin = await User.create({ name: 'مشرف', email: adminEmail, passwordHash: hash, role: 'admin' })
    console.log('Seeded admin user (hamza)')
  } else {
    admin.passwordHash = hash
    await admin.save()
    console.log('Admin credentials updated (hamza)')
  }

  const prodCount = await Product.countDocuments()
  if (prodCount === 0) {
    await Product.create({
      title: 'قميص قماشي',
      description: 'قميص عالي الجودة',
      price: 19.99,
      stock: 50,
      category: 'الملابس',
      imageUrls: [],
      variations: [
        { color: 'أزرق', size: 'M', dimensions: 'O', weight: 0.2, stock: 15, price: 19.99 },
        { color: 'أسود', size: 'L', dimensions: 'O', weight: 0.22, stock: 10, price: 19.99 }
      ],
      details: [{ key: 'المادة', value: 'قطن' }]
    })
    await Product.create({
      title: 'سوار أنيق',
      description: 'سوار معدني أنيق',
      price: 9.99,
      stock: 100,
      category: 'إكسسوارات',
      imageUrls: [],
      variations: [
        { color: 'ذهبي', size: 'One', stock: 25, price: 9.99 }
      ],
      details: [{ key: 'المادة', value: 'نحاس مطلي' }]
    })
    console.log('Seeded sample products')
  }
  process.exit(0)
}

async function run() {
  if (!mongoURI) {
    console.error('MongoDB URI غير متوفر في المتغيرات البيئية')
    process.exit(1)
  }
  try {
    await connectDB(mongoURI)
    await seed()
  } catch (err) {
    console.error('فشل الاتصال بقاعدة البيانات:', err)
    process.exit(1)
  }
}

run().catch(err => {
  console.error('Seed error:', err)
  process.exit(1)
})
