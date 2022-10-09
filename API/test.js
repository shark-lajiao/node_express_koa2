const { db, mysqli } = require("../db/index");
exports.test = async (req, res) => {
  console.log("访问test");
  res.send("访问test");
};
