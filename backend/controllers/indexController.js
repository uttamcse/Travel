const getHomeInfo = (req, res) => {
  const name = process.env.NAME || "Travel!";
  res.json({ info: `Hello ${name}` });
};

module.exports = { getHomeInfo };