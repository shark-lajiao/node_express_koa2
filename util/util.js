/*
 * @Author: Undecimber 2059085250@qq.com
 * @Date: 2022-08-01 09:24:02
 * @LastEditors: Undecimber 2059085250@qq.com
 * @LastEditTime: 2022-09-30 17:01:20
 * @FilePath: \server\util\util.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const isToday = (str) => {
  let d = new Date(str).setHours(0, 0, 0, 0);
  let today = new Date().setHours(0, 0, 0, 0);
  let obj = {
    "-86400000": "昨天",
    0: "今天",
    86400000: "明天",
  };
  return obj[d - today] || "只有今天明天后天噢~";
};

// 获取间隔天数
const getDays = function getDays(day1, day2, days) {
  // 获取入参字符串形式日期的Date型日期
  var st = day1.getDate();
  var et = day2.getDate();
  // console.log(st.getTime(), et.getTime());
  if (st.getTime() > et.getTime()) {
    return false;
  }
  var re;
  /*
   * @Author: Undecimber 2059085250@qq.com
   * @Date: 2022-08-01 09:24:02
   * @LastEditors: Undecimber 2059085250@qq.com
   * @LastEditTime: 2022-09-30 17:01:20
   * @FilePath: \server\util\util.js
   * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
   */
  const isToday = (str) => {
    let d = new Date(str).setHours(0, 0, 0, 0);
    let today = new Date().setHours(0, 0, 0, 0);
    let obj = {
      "-86400000": "昨天",
      0: "今天",
      86400000: "明天",
    };
    return obj[d - today] || "只有今天明天后天噢~";
  };

  // 获取间隔天数
  const getDays = function getDays(day1, day2, days) {
    // 获取入参字符串形式日期的Date型日期
    var st = day1.getDate();
    var et = day2.getDate();
    // console.log(st.getTime(), et.getTime());
    if (st.getTime() > et.getTime()) {
      return false;
    }
    var retArr = [];

    // 获取开始日期的年，月，日
    var yyyy = st.getFullYear(),
      mm = st.getMonth(),
      dd = st.getDate();

    // 循环
    while (st.getTime() != et.getTime()) {
      retArr.push(st.getYMD());
      // console.log(st.getYMD(), isToday(st.getYMD()), days);
      if (isToday(st.getYMD()) === days) return true;
      // 使用dd++进行天数的自增
      st = new Date(yyyy, mm, ++dd);
    }

    return false;
    // 将结束日期的天放进数组
    // retArr.push(et.getYMD());

    // return (retArr); // 或可换为return ret;
  };

  // 给Date对象添加getYMD方法，获取字符串形式的年月日
  Date.prototype.getYMD = function () {
    // 将结果放在数组中，使用数组的join方法返回连接起来的字符串，并给不足两位的天和月十位上补零
    return [
      this.getFullYear(),
      fz(this.getMonth() + 1),
      fz(this.getDate()),
    ].join("-");
  };

  // 给String对象添加getDate方法，使字符串形式的日期返回为Date型的日期
  String.prototype.getDate = function () {
    var strArr = this.split("-");
    return new Date(strArr[0], strArr[1] - 1, strArr[2]);
  };

  // 给月和天，不足两位的前面补0
  function fz(num) {
    if (num < 10) {
      num = "0" + num;
    }
    return num;
  }

  function Myerror(errcode = 50000, message = {}) {
    this.name = "Myerror";
    this.errcode = errcode;
    this.resBody = message;
    this.stack = new Error().stack;
  }
  Myerror.prototype = Object.create(Error.prototype);
  Myerror.prototype.constructor = Myerror;

  module.exports = {
    Myerror,
    isToday,
    getDays,
  };
};
