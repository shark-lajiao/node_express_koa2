const { db, mysqli } = require("../db/index");
const router = require("koa-router")();
router.prefix("/api");
router.get("/table/list", async (ctx, next) => {
  const { pageSize, page } = ctx.query;
  let sql = `select * from tabel order by id limit ${page}
  ,${pageSize}`;
  let result = await mysqli(sql);
  let sql2 = `select count(*) from tabel`;
  let result2 = await mysqli(sql2);
  ctx.response.body = {
    code: "200",
    list: result.data,
    total: result2.data[0]["count(*)"],
  };
});
module.exports = router;
