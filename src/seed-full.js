// Comprehensive seed script with categories structure
require('dotenv').config()
const connectDB = require('./config/db')
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI

const User = require('./models/User')
const Admin = require('./models/Admin')
const Product = require('./models/Product')
const Category = require('./models/Category')
const Order = require('./models/Order')
const Cart = require('./models/Cart')
const bcrypt = require('bcrypt')

// Categories data
const categoriesData = [
  { name: 'الإلكترونيات', description: 'أجهزة إلكترونية وموبايلات', icon: 'laptop', sortOrder: 1 },
  { name: 'الملابس', description: 'ملابس رجالية ونسائية وأطفال', icon: 'shirt', sortOrder: 2 },
  { name: 'الإكسسوارات', description: 'إكسسوارات وساعات ومجوهرات', icon: 'watch', sortOrder: 3 },
  { name: 'المنزل والحديقة', description: 'أثاث وديكور وأدوات منزلية', icon: 'home', sortOrder: 4 },
  { name: 'الرياضة', description: 'معدات رياضية وملابس رياضية', icon: 'dumbbell', sortOrder: 5 },
  { name: 'الصحة والجمال', description: 'مستحضرات تجميل ومنتجات صحية', icon: 'heart', sortOrder: 6 },
  { name: 'الكتب', description: 'كتب وقرطاسية ومكتبات', icon: 'book', sortOrder: 7 },
  { name: 'ألعاب', description: 'ألعاب أطفال وهدايا', icon: 'gamepad', sortOrder: 8 },
]

// Admin user credentials
const adminUser = {
  name: 'المشرف',
  email: 'hamza@hamza.com',
  password: 'hamza9090',
  role: 'admin'
}

// Regular users
const regularUsers = [
  { name: 'أحمد محمد', email: 'ahmed@test.com', password: 'user123', role: 'customer' },
  { name: 'سارة علي', email: 'sara@test.com', password: 'user123', role: 'customer' },
  { name: 'خالد عمر', email: 'khaled@test.com', password: 'user123', role: 'customer' },
]

// Products data (will reference categories by name, then convert to ObjectId)
const productsData = [
  {
    title: 'iPhone 15 Pro',
    description: 'أحدث هاتف آيفون مع كاميرا احترافية',
    price: 4599.99,
    stock: 25,
    categoryName: 'الإلكترونيات',
    imageUrls: [],
    variations: [
      { color: 'أسود', size: '256GB', stock: 10, price: 4599.99 },
      { color: 'أبيض', size: '512GB', stock: 8, price: 5099.99 },
      { color: 'تيتانيوم', size: '1TB', stock: 7, price: 5799.99 }
    ],
    details: [
      { key: 'الشاشة', value: '6.1 بوصة OLED' },
      { key: 'المعالج', value: 'A17 Pro' },
      { key: 'الكاميرا', value: '48MP رئيسية' }
    ]
  },
  {
    title: 'سماعات AirPods Pro 2',
    description: 'سماعات لاسلكية مع إلغاء ضوضاء نشط',
    price: 899.99,
    stock: 50,
    categoryName: 'الإلكترونيات',
    imageUrls: [],
    variations: [
      { color: 'أبيض', stock: 50, price: 899.99 }
    ],
    details: [
      { key: 'البطارية', value: '30 ساعة مع العلبة' },
      { key: 'الميزة', value: 'إلغاء الضوضاء' }
    ]
  },
  {
    title: 'قميص بولو رجالي',
    description: 'قميص بولو قطني 100% بجودة عالية',
    price: 149.99,
    stock: 100,
    categoryName: 'الملابس',
    imageUrls: [],
    variations: [
      { color: 'أزرق', size: 'M', stock: 25, price: 149.99 },
      { color: 'أزرق', size: 'L', stock: 20, price: 149.99 },
      { color: 'أبيض', size: 'M', stock: 30, price: 149.99 },
      { color: 'أسود', size: 'L', stock: 25, price: 149.99 }
    ],
    details: [
      { key: 'المادة', value: 'قطن 100%' },
      { key: 'البلد', value: 'مصر' }
    ]
  },
  {
    title: 'فستان صيفي',
    description: 'فستان قطني خفيف للصيف',
    price: 199.99,
    stock: 40,
    categoryName: 'الملابس',
    imageUrls: [],
    variations: [
      { color: 'أحمر', size: 'S', stock: 10, price: 199.99 },
      { color: 'أحمر', size: 'M', stock: 15, price: 199.99 },
      { color: 'أزرق', size: 'M', stock: 10, price: 199.99 },
      { color: 'أزرق', size: 'L', stock: 5, price: 199.99 }
    ],
    details: [
      { key: 'المادة', value: 'قطن وكتان' },
      { key: 'الطول', value: 'وسطي' }
    ]
  },
  {
    title: 'ساعة ذكية Apple Watch',
    description: 'ساعة ذكية مع تتبع اللياقة والصحة',
    price: 1299.99,
    stock: 30,
    categoryName: 'الإكسسوارات',
    imageUrls: [],
    variations: [
      { color: 'أسود', size: '45mm', stock: 15, price: 1299.99 },
      { color: 'أبيض', size: '41mm', stock: 15, price: 1199.99 }
    ],
    details: [
      { key: 'الشاشة', value: 'Retina LTPO' },
      { key: 'المقاومة', value: 'ماء 50 متر' }
    ]
  },
  {
    title: 'سوار ذهبي أنيق',
    description: 'سوار ذهب عيار 18 قيراط',
    price: 899.99,
    stock: 20,
    categoryName: 'الإكسسوارات',
    imageUrls: [],
    variations: [
      { color: 'ذهبي', size: '18cm', stock: 10, price: 899.99 },
      { color: 'ذهبي', size: '20cm', stock: 10, price: 899.99 }
    ],
    details: [
      { key: 'العيار', value: '18 قيراط' },
      { key: 'الوزن', value: '12 جرام' }
    ]
  },
  {
    title: 'كرسي مكتب مريح',
    description: 'كرسي مكتب مريح مع دعم للظهر',
    price: 599.99,
    stock: 15,
    categoryName: 'المنزل والحديقة',
    imageUrls: [],
    variations: [
      { color: 'أسود', stock: 10, price: 599.99 },
      { color: 'رمادي', stock: 5, price: 599.99 }
    ],
    details: [
      { key: 'المادة', value: 'جلد صناعي' },
      { key: 'الارتفاع', value: 'قابل للتعديل' }
    ]
  },
  {
    title: 'مصباح مكتب LED',
    description: 'مصباح مكتب حديث مع إضاءة قابلة للتعديل',
    price: 129.99,
    stock: 45,
    categoryName: 'المنزل والحديقة',
    imageUrls: [],
    variations: [
      { color: 'أبيض', stock: 25, price: 129.99 },
      { color: 'أسود', stock: 20, price: 129.99 }
    ],
    details: [
      { key: 'القوة', value: '12 واط' },
      { key: 'الألوان', value: '3 أوضاع إضاءة' }
    ]
  },
  {
    title: 'دمبلز 5 كجم',
    description: 'أثقال دمبلز للتمارين الرياضية',
    price: 79.99,
    stock: 60,
    categoryName: 'الرياضة',
    imageUrls: [],
    variations: [
      { color: 'أسود', size: '5kg', stock: 30, price: 79.99 },
      { color: 'أسود', size: '10kg', stock: 30, price: 129.99 }
    ],
    details: [
      { key: 'المادة', value: 'حديد مطلي' },
      { key: 'الاستخدام', value: 'منزلي أو نادي' }
    ]
  },
  {
    title: 'زجاجة ماء رياضية',
    description: 'زجاجة ماء 1 لتر مع عزل حراري',
    price: 49.99,
    stock: 100,
    categoryName: 'الرياضة',
    imageUrls: [],
    variations: [
      { color: 'أزرق', stock: 40, price: 49.99 },
      { color: 'أحمر', stock: 30, price: 49.99 },
      { color: 'أسود', stock: 30, price: 49.99 }
    ],
    details: [
      { key: 'السعة', value: '1 لتر' },
      { key: 'المادة', value: 'ستانلس ستيل' }
    ]
  },
  {
    title: 'كريم مرطب للبشرة',
    description: 'كريم ترطيب عميق للوجه والجسم',
    price: 89.99,
    stock: 80,
    categoryName: 'الصحة والجمال',
    imageUrls: [],
    variations: [
      { color: 'أبيض', size: '100ml', stock: 50, price: 89.99 },
      { color: 'أبيض', size: '250ml', stock: 30, price: 159.99 }
    ],
    details: [
      { key: 'النوع', value: 'جميع أنواع البشرة' },
      { key: 'المكونات', value: 'طبيعية 100%' }
    ]
  },
  {
    title: 'شامبو للشعر',
    description: 'شامبو لتقوية الشعر وتغذيته',
    price: 59.99,
    stock: 70,
    categoryName: 'الصحة والجمال',
    imageUrls: [],
    variations: [
      { color: 'أبيض', size: '400ml', stock: 40, price: 59.99 },
      { color: 'أبيض', size: '750ml', stock: 30, price: 89.99 }
    ],
    details: [
      { key: 'النوع', value: 'جميع أنواع الشعر' },
      { key: 'خالي من', value: 'سلفات وأملاح' }
    ]
  },
  {
    title: 'كتاب تطوير الذات',
    description: 'كتاب عن النجاح وتطوير الذات',
    price: 69.99,
    stock: 50,
    categoryName: 'الكتب',
    imageUrls: [],
    variations: [
      { color: 'طباعة', stock: 50, price: 69.99 }
    ],
    details: [
      { key: 'الصفحات', value: '280 صفحة' },
      { key: 'اللغة', value: 'العربية' }
    ]
  },
  {
    title: 'دفتر ملاحظات',
    description: 'دفتر جلدي فاخر للكتابة',
    price: 39.99,
    stock: 100,
    categoryName: 'الكتب',
    imageUrls: [],
    variations: [
      { color: 'بني', size: 'A5', stock: 50, price: 39.99 },
      { color: 'أسود', size: 'A5', stock: 50, price: 39.99 }
    ],
    details: [
      { key: 'الأوراق', value: '200 ورقة' },
      { key: 'الغلاف', value: 'جلد طبيعي' }
    ]
  },
  {
    title: 'لعبة بناء أطفال',
    description: 'لعبة مكعبات بناء للأطفال 3+',
    price: 119.99,
    stock: 40,
    categoryName: 'ألعاب',
    imageUrls: [],
    variations: [
      { color: 'متعدد', stock: 40, price: 119.99 }
    ],
    details: [
      { key: 'العمر', value: '3+ سنوات' },
      { key: 'القطع', value: '100 قطعة' }
    ]
  },
  {
    title: 'دمية محشوة',
    description: 'دمية لطيفة للأطفال',
    price: 79.99,
    stock: 60,
    categoryName: 'ألعاب',
    imageUrls: [],
    variations: [
      { color: 'وردي', size: '30cm', stock: 30, price: 79.99 },
      { color: 'أزرق', size: '30cm', stock: 30, price: 79.99 }
    ],
    details: [
      { key: 'المادة', value: 'قطن ناعم' },
      { key: 'الغسيل', value: 'يدوي' }
    ]
  }
]

async function seed() {
  console.log('Starting comprehensive seed...\n')

  // 1. Create categories
  console.log('Creating categories...')
  const createdCategories = {}
  for (const catData of categoriesData) {
    const category = await Category.create(catData)
    createdCategories[catData.name] = category._id
    console.log(`  ✓ Created category: ${catData.name}`)
  }

  // 2. Create or update admin user in separate Admin collection
  console.log('\nCreating/updating admin user...')
  const adminHash = await bcrypt.hash(adminUser.password, 10)

  let admin = await Admin.findOne({ email: adminUser.email })
  if (admin) {
    // Update existing admin
    admin.name = adminUser.name
    admin.passwordHash = adminHash
    admin.role = 'admin'
    admin.isActive = true
    await admin.save()
    console.log(`  ✓ Admin updated: ${adminUser.email} / ${adminUser.password}`)
  } else {
    // Create new admin
    admin = await Admin.create({
      name: adminUser.name,
      email: adminUser.email,
      passwordHash: adminHash,
      role: adminUser.role,
      isActive: true
    })
    console.log(`  ✓ Admin created: ${adminUser.email} / ${adminUser.password}`)
  }

  // 3. Create regular users
  console.log('\nCreating regular users...')
  const createdUsers = []
  for (const userData of regularUsers) {
    const hash = await bcrypt.hash(userData.password, 10)
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      passwordHash: hash,
      role: userData.role
    })
    createdUsers.push(user)
    console.log(`  ✓ User: ${userData.email} / ${userData.password}`)
  }

  // 4. Create products with category references
  console.log('\nCreating products...')
  const createdProducts = []
  for (const prodData of productsData) {
    const categoryId = createdCategories[prodData.categoryName]
    const product = await Product.create({
      title: prodData.title,
      description: prodData.description,
      price: prodData.price,
      stock: prodData.stock,
      category: categoryId,
      imageUrls: prodData.imageUrls,
      variations: prodData.variations,
      details: prodData.details
    })
    createdProducts.push(product)
    console.log(`  ✓ Product: ${prodData.title} (${prodData.categoryName})`)
  }

  // 5. Create sample orders
  console.log('\nCreating sample orders...')
  if (createdUsers.length > 0 && createdProducts.length > 0) {
    const order1 = await Order.create({
      user: createdUsers[0]._id,
      items: [
        { productId: createdProducts[0]._id, quantity: 1, priceAtPurchase: createdProducts[0].price },
        { productId: createdProducts[2]._id, quantity: 2, priceAtPurchase: createdProducts[2].price }
      ],
      total: createdProducts[0].price + (createdProducts[2].price * 2),
      status: 'completed'
    })
    console.log(`  ✓ Order 1 for ${createdUsers[0].name}`)

    const order2 = await Order.create({
      user: createdUsers[1]._id,
      items: [
        { productId: createdProducts[5]._id, quantity: 1, priceAtPurchase: createdProducts[5].price }
      ],
      total: createdProducts[5].price,
      status: 'pending'
    })
    console.log(`  ✓ Order 2 for ${createdUsers[1].name}`)
  }

  // 6. Create sample carts
  console.log('\nCreating sample carts...')
  if (createdUsers.length > 0 && createdProducts.length > 0) {
    await Cart.create({
      user: createdUsers[2]._id,
      items: [
        { productId: createdProducts[1]._id, quantity: 1 },
        { productId: createdProducts[3]._id, quantity: 1 }
      ]
    })
    console.log(`  ✓ Cart for ${createdUsers[2].name}`)
  }

  console.log('\n✅ Seed completed successfully!')
  console.log('\nSummary:')
  console.log(`  • ${categoriesData.length} categories`)
  console.log(`  • ${regularUsers.length + 1} users (1 admin + ${regularUsers.length} customers)`)
  console.log(`  • ${productsData.length} products`)
  console.log(`  • 2 sample orders`)
  console.log(`  • 1 sample cart`)
}

async function run() {
  if (!mongoURI) {
    console.error('MongoDB URI غير متوفر في المتغيرات البيئية')
    process.exit(1)
  }
  try {
    await connectDB(mongoURI)
    await seed()
    process.exit(0)
  } catch (err) {
    console.error('فشل التنفيذ:', err)
    process.exit(1)
  }
}

run().catch(err => {
  console.error('Seed error:', err)
  process.exit(1)
})
