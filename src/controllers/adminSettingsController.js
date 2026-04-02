async function getSettings(req, res) {
  const settings = {
    shippingMethods: ['Standard','Express'],
    paymentGateways: ['Stripe','PayPal'],
    currencies: ['USD','EUR','SAR'],
    languages: ['ar','en']
  }
  res.json(settings)
}
async function updateSettings(req, res) {
  // In a real app, you'd persist settings; here we echo back for demo
  res.json({ message: 'الإعدادات محدثة', payload: req.body })
}
module.exports = {
  getSettings,
  updateSettings
}
