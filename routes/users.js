const router = require("koa-router")();
const { db, mysqli } = require("../db/index");
const { getJWTPayload } = require("../module/jwt");
router.prefix("/api");

// 获得权限
router.post("/admin_info", async (ctx, next) => {
  const payload = getJWTPayload(ctx.headers.authorization);
  const { username } = payload;
  let sql = "select * from adminInfo where username = ?";
  let result = await mysqli(sql, [username]);
  let userdata = {
    user: username,
    permissions: [
      {
        label: "主控台",
        value: "dashboard_console",
      },
      {
        label: "监控页",
        value: "dashboard_monitor",
      },
      {
        label: "工作台",
        value: "dashboard_workplace",
      },
      {
        label: "基础列表",
        value: "basic_list",
      },
      {
        label: "基础列表删除",
        value: "basic_list_delete",
      },
    ],
  };
  if (result.data.length > 0) {
    console.log("result.data[0].permissions", result.data[0].permissions);
    if (result.data[0].permissions == 1) {
      ctx.response.body = {
        code: "200",
        message: userdata,
      };
    } else {
      ctx.response.body = {
        code: "200",
        message: { user: username, permissions: ["没有权限"] },
      };
    }
  } else {
    ctx.response.body = {
      code: "400",
      message: "用户不存在",
    };
  }
});

module.exports = router;
