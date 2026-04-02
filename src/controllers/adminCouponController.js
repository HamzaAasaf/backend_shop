const Coupon = require('../models/Coupon')

async function getCoupons(req, res) {
  try {
    const coupons = await Coupon.find({})
    res.json(coupons)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

async function createCoupon(req, res) {
  const { code, discount, type, minPurchase, expiresAt, active, maxUsage } = req.body
  if (!code || typeof discount !== 'number') {
    return res.status(400).json({ message: 'يجب توفير code و discount' })
  }
  try {
    const coupon = new Coupon({ code, discount, type: type || 'percent', minPurchase, expiresAt, active, maxUsage })
    await coupon.save()
    res.status(201).json(coupon)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

async function getCouponByCode(req, res) {
  const { code } = req.params
  try {
    const coupon = await Coupon.findOne({ code })
    if (!coupon) return res.status(404).json({ message: 'الكوبون غير موجود' })
    res.json(coupon)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

async function getCouponById(req, res) {
  const { id } = req.params
  try {
    const coupon = await Coupon.findById(id)
    if (!coupon) return res.status(404).json({ message: 'الكوبون غير موجود' })
    res.json(coupon)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

async function updateCoupon(req, res) {
  const { id } = req.params
  try {
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true })
    if (!coupon) return res.status(404).json({ message: 'الكوبون غير موجود' })
    res.json(coupon)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

async function deleteCoupon(req, res) {
  const { id } = req.params
  try {
    const coupon = await Coupon.findByIdAndDelete(id)
    if (!coupon) return res.status(404).json({ message: 'الكوبون غير موجود' })
    res.json({ message: 'تم حذف الكوبون' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'خطأ في الخادم' })
  }
}

module.exports = {
  getCoupons,
  createCoupon,
  getCouponByCode,
  getCouponById,
  updateCoupon,
  deleteCoupon,
}
