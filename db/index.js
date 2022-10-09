/*
 * @Author: Undecimber 2059085250@qq.com
 * @Date: 2022-08-01 09:24:02
 * @LastEditors: Undecimber 2059085250@qq.com
 * @LastEditTime: 2022-09-30 17:01:24
 * @FilePath: \server\util\token.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const mysql = require("mysql");
const { resolve } = require("path");
const request1 = require("request");
const sqldata = {
  sql_1: {
    host: "localhost", //数据库IP地址
    port: "3306",
    user: "root", //数据库登录账号
    password: "11111", //数据库登录密码
    database: "admin", //要操作的数据库
  },
};
const db = mysql.createPool(sqldata.sql_1);
const mysqli = function (sql, params) {
  return new Promise((resolve, reject) => {
    db.getConnection(function (err, connection) {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, params, (err, data) => {
          if (err) {
            reject({
              code: 250,
              message: err,
            });
          } else {
            resolve({
              code: 200,
              data: JSON.parse(JSON.stringify(data)),
            });
          }
          connection.release();
        });
      }
    });
  }).catch((err) => {
    console.log("promiseerror：", err);
  });
};

// const cnwh = function (data1, data2) {
//   return new Promise((resolve, reject) => {
//     let url =
//       "http://hy.imes.zte.com.cn/zte-mes-manufactureshare-basicsettingsys/BMC/bsBarcodeInfo";
//     let resData = {
//       page: "1",
//       rows: "10000",
//       itemCode: data1,
//       lineCode: data2,
//       order: "desc",
//       sort: "lastUpdatedDate",
//     };
//     request1(
//       {
//         url: url,
//         method: "GET",
//         timeout: 3000000,
//         json: true,
//         headers: {
//           "content-type": "application/json",
//           // "content-type": "text/json",
//           "X-Emp-No": 10313234,
//           "X-Factory-Id": 55,
//         },
//         qs: resData,
//       },
//       function (error, response, bodys) {
//         if (error) {
//           // console.log(123);
//           reject({
//             status: 501,
//             message: "产能接口错误~",
//             data: error,
//           });
//         } else {
//           // console.log(data1, "-" + data2, 456, bodys.bo);
//           resolve({
//             status: 200,
//             message: "产能维护~",
//             data: bodys.bo,
//           });
//         }
//       }
//     );
//   }).catch((err) => {
//     console.log("promiseerror2：", err);
//   });
// };

module.exports = {
  db,
  sqldata,
  mysqli,
  // cnwh,
};
