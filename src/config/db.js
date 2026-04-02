const mongoose = require('mongoose')

// Connect to MongoDB using a provided URI
module.exports = async function connectDB(uri) {
  if (!uri) throw new Error('MongoDB URI is required')
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err)
    throw err
  }
}
