module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(JSON.stringify({ status: "Zinda Hoon!", message: "Laser Mapping worked!" }));
};
