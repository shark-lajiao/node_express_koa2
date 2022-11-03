const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const jwtKoa = require("koa-jwt");
const cors = require("koa2-cors");
const fs = require("fs");
//引入模块
const index = require("./routes/index");
const users = require("./routes/users");
const dashboard = require("./routes/dashboard");
const usertabel = require("./routes/tabel");
//密钥
const { secret } = require("./config/index");

// const routerArr = fs.readdirSync(__dirname + "/routes");
// console.log(routerArr, "routerArradsdasdasdsad");
// routerArr.forEach((item, index) => {
//   const index = require("./routes/" + item);
//   console.log(router, "router");
//   app.use(index.routes(), index.allowedMethods());
// });

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));
app.use(
  views(__dirname + "/views", {
    extension: "ejs",
  })
);
app.use(cors()); //配置跨域
app.use((ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        ok: false,
        code: 401,
        msg: err.originalError ? err.originalError.message : err.message,
      };
    } else {
      throw err;
    }
  });
});
// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

/* 路由权限控制 */
app.use(
  jwtKoa({ secret: secret }).unless({
    // 设置login、register接口，可以不需要认证访问
    path: [
      /^\/api\/login/,
      /^\/api\/register/,
      /^((?!).)*$/, // 设置除了私有接口外的其它资源，可以不需要认证访问
    ],
  })
);

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(dashboard.routes(), dashboard.allowedMethods());
app.use(usertabel.routes(), usertabel.allowedMethods());
// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
