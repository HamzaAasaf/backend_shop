require('dotenv').config()
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')
const cors = require('cors')
const express = require('express')
const swaggerUi = require('swagger-ui-express')
const YAML = require('js-yaml')
const fs = require('fs')
const app = express()

app.use(express.json())
// CORS for admin dashboard frontend (React/Next.js SPA on port 3000)
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

// Routers
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const cartRoutes = require('./routes/cartRoutes')
const adminRoutes = require('./routes/adminRoutes')

app.use('/api', authRoutes)
app.use('/api', productRoutes)
app.use('/api', orderRoutes)
app.use('/api', cartRoutes)
app.use('/api', adminRoutes)
// Swagger/OpenAPI العربية (محلي)
let swaggerDocument = {}
try {
  const yamlPath = path.join(__dirname, '../docs/openapi-ar.yaml')
  swaggerDocument = YAML.load(fs.readFileSync(yamlPath, 'utf8'))
} catch (err) {
  console.error('فشل تحميل ملف OpenAPI العربية:', err)
  swaggerDocument = {}
}
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
// Serve Admin Dashboard as a static frontend
app.use('/admin-dashboard', express.static(path.join(__dirname, '../admin-dashboard')))
// Fallback route to ensure index.html is served for /admin-dashboard
app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../admin-dashboard/index.html'))
})
// Proxy admin dashboard SPA (Next.js) running on port 3000
app.use('/admin-dashboard', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: { '^/admin-dashboard': '' }
}))

const PORT = process.env.PORT || 5000

async function start() {
  try {
    const connectDB = require('./config/db')
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL
    if (!mongoURI) {
      console.error('MongoDB URI غير متوفر في المتغيرات البيئية')
      process.exit(1)
    }
    await connectDB(mongoURI)
    app.listen(PORT, () => {
      console.log(`Server متصل ويعمل على http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('فشل بدء السيرفر:', err)
    process.exit(1)
  }
}

start()
