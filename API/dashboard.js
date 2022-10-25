const { db, mysqli } = require("../db/index");
const { Random } = require("mockjs");
const consoleInfo = {
  //访问量
  visits: {
    dayVisits: Random.float(10000, 99999, 2, 2),
    rise: Random.float(10, 99),
    decline: Random.float(10, 99),
    amount: Random.float(99999, 999999, 3, 5),
  },
  //销售额
  saleroom: {
    weekSaleroom: Random.float(10000, 99999, 2, 2),
    amount: Random.float(99999, 999999, 2, 2),
    degree: Random.float(10, 99),
  },
  //订单量
  orderLarge: {
    weekLarge: Random.float(10000, 99999, 2, 2),
    rise: Random.float(10, 99),
    decline: Random.float(10, 99),
    amount: Random.float(99999, 999999, 2, 2),
  },
  //成交额度
  volume: {
    weekLarge: Random.float(10000, 99999, 2, 2),
    rise: Random.float(10, 99),
    decline: Random.float(10, 99),
    amount: Random.float(99999, 999999, 2, 2),
  },
};
exports.data = async (req, res) => {
  res.send(consoleInfo);
};
