const mysql = require("mysql");
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
module.exports = {
  db,
  sqldata,
  mysqli,
};
