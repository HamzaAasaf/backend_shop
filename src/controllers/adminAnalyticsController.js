async function getAnalytics(req, res) {
  // Placeholder analytics data
  const data = {
    salesToday: 0,
    salesMonth: 0,
    topProducts: [],
    topLocations: []
  }
  res.json(data)
}

module.exports = {
  getAnalytics,
}
