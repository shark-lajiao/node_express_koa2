/*
 * @Author: Undecimber 2059085250@qq.com
 * @Date: 2022-08-01 09:24:02
 * @LastEditors: Undecimber 2059085250@qq.com
 * @LastEditTime: 2022-09-30 17:01:24
 * @FilePath: \server\util\token.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const jwt = require("jsonwebtoken");
const singKey = "secret"; // 这里可以自己设置

exports.setToken = (UserNumber) => {
  return new Promise((resolve, reject) => {
    const token = jwt.sign(
      {
        UserNumber,
      },
      singKey,
      {
        expiresIn: 60 * 60000 * 24,
        algorithm: "HS256",
      }
    );
    resolve(token);
  });
};

exports.verToken = (token) => {
  return new Promise((resolve, reject) => {
    let info = jwt.verify(token, singKey);
    resolve(info);
  });
};
exports.singKey = singKey;
