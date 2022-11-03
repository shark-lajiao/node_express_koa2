const router = require("koa-router")();
const jwt = require("jsonwebtoken");
const path = require("path");
const { db, mysqli } = require("../db/index");
const { getJWTPayload, getToken } = require("../module/jwt");
const { secret } = require("../config/index");

router.prefix("/api");
// 登录
router.post("/login", async (ctx, next) => {
  const { username, password } = ctx.request.body;
  let payload = { username }; // 加密的数据
  let permissions;
  let sql = "select * from login where user = ?";
  let result = await mysqli(sql, [username]);
  if (result.data.length > 0) {
    permissions = result.data[0];
    if (password == permissions.passwrod) {
      let token = jwt.sign(payload, secret, { expiresIn: "1h" });
      ctx.response.body = {
        code: "200",
        username: permissions.user,
        token: getToken(payload),
      };
    } else {
      ctx.response.body = {
        code: "400",
        msg: "密码错误",
      };
    }
  } else {
    ctx.response.body = {
      code: "400",
      msg: "用户不存在",
    };
  }
});

module.exports = router;
