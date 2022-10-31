const { db, mysqli } = require("../db/index");
exports.usertabel = async (req, res) => {
  console.log(req.query);
  let pageSize = req.query.pageSize;
  let offset = req.query.page;
  console.log(pageSize, offset);
  let sql = `select * from tabel order by id limit ${offset}
  , ${Number(pageSize)};`;

  let result = await mysqli(sql);
  let data = {
    list: result.data,
    count: pageSize,
    total: result.data.length,
  };
  res.send(data);
};
