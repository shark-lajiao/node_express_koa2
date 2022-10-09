/*
 * @Author: Undecimber 2059085250@qq.com
 * @Date: 2022-08-01 09:24:02
 * @LastEditors: Undecimber 2059085250@qq.com
 * @LastEditTime: 2022-09-30 17:01:24
 * @FilePath: \server\util\token.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require("express");
const fs = require("fs");
const expressJwt = require("express-jwt");
const path = require("path");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const verToken = require("./util/token");
const router = require("./router");
const history = require("connect-history-api-fallback");
/*部署时*/
// const host = "10.142.6.6"
// const port = '3300'
/*························*/
const host = "127.0.0.1";
const port = "10099";
app.use(bodyParser.json({ limit: "1000mb" })); //配置解析，用于解析json和urlencoded格式的数据
app.use(bodyParser.urlencoded({ limit: "1000mb", extended: true }));
app.use(cors()); //配置跨域

app.use(function (req, res, next) {
  // /v/getlist
  // /v/getlist2
  // /login
  //通过ur1获取前端请求的路由
  const {
    url,
    headers: { authorization },
  } = req;
  // console.log(url, 22222);
  if (/.*api.*/.test(url)) {
    console.log(url);
    //设置不需要验证token的路由

    if (url == "/api/login") return next();
    const token = authorization && authorization.slice(7);

    verToken
      .verToken(token)
      .then((data) => {
        // console.log(data);
        req.data = data; //如果验证成功就执行then这块,将token解析之后的数据赋值给req
        next();
      })
      .catch((err) => {
        //验证失败进入这一行,通过错误信息返回对应的原因
        switch (err.message) {
          case "jwt must be provided":
            console.log(err.message);
            return res.send({
              code: 0,
              msg: "没有token：jwt must be provided",
            });
          case "jwt expired":
            console.log(err.message);
            return res.send({
              code: 0,
              msg: "token过期",
            });
          case "invalid token" || "jwt malformed":
            console.log(err.message);
            return res.send({
              code: 0,
              msg: "无效的token",
            });
          case "No authorization token was found":
            console.log(err.message);
            return res.send({
              code: 0,
              msg: "没有token",
            });
          default:
            console.log(err.message);
            // console.log(err);
            next();
        }
      });
  } else {
    next();
  }
});
app.use("/api", router); //配置路由
app.use(history());
/*·······部署时*/
app.use(express.static(path.resolve(__dirname, "./dist")));
app.use(express.static("./assets"));
// app.get('*', function(req, res) {
//     const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8'); // 设置所有访问服务请求默认返回index.html文件
//     res.send(html);
// });
/*·····················*/
// const ERRCODE = {
//     0: {
//         status: 200,
//         body: {
//             errcode: "0",
//             errmsg: "ok"
//         }
//     },
//     40001: {
//         status: 400,
//         body: {
//             errcode: "40001",
//             errmsg: "参数错误"
//         }
//     }
// }
// function errcode(code, res = {}) {
//     return {
//         ...(ERRCODE[code] || ERRCODE[500000]),
//         body: {
//             ...(ERRCODE[code] || ERRCODE[500000]),
//             body,
//             ...res
//         }
//     }
// }
// app.use(function ErrorHandler(err, req, res, next) {
//     //统一错误处理
//     if (!err.errcode) {
//         res.status(404).send({
//             errcode: "404",
//             errmsg: "404"
//         });
//     }
//     if (errcode(err.errcode)) {
//         const { status, errBody } = errcode(err.errcode);
//         res.status(status).send(errBody)
//     }
// })
app.listen(port, host, function () {
  console.log("服务器启动成功");
  console.log("http://" + host + ":" + port);
});
