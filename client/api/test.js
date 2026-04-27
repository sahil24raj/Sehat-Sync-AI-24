module.exports = (req, res) => {
  res.status(200).json({ status: "Zinda Hoon!", timestamp: new Date().toISOString() });
};
