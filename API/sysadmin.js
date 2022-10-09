/*
 * @Author: Undecimber 2059085250@qq.com
 * @Date: 2022-08-01 09:24:02
 * @LastEditors: Undecimber 2059085250@qq.com
 * @LastEditTime: 2022-09-30 17:01:24
 * @FilePath: \server\util\token.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

let { mysqli } = require("../db/index");

//根据通知查询具体内容
exports.notice_select = async (req, res) => {
  //根据通知查询具体内容

  //根据通知查询具体内容
  if (req.query.type === "CKGZTZ") {
    //修改通知状态（已读）
    let sql_1 =
      "UPDATE `Sys_notice_consult` set N_Read=2 where N_UserID='" +
      req.query.UserNumber +
      "' AND N_from='" +
      req.query.N_dan +
      "'";
    let resdb_1 = await mysqli(sql_1);
    let sql =
      "SELECT *,DATE_FORMAT(Create_Time,'%Y-%m-%d %T') FROM `sys_maintain` WHERE Repair_Order='" +
      req.query.N_dan +
      "'";
    let resdb = await mysqli(sql);
    for (const i in resdb.data) {
      resdb.data[i].now_status =
        resdb.data[i].Now_Status === 1
          ? "待验证"
          : resdb.data[i].Now_Status === 2
          ? "待维修"
          : resdb.data[i].Now_Status === 3
          ? "维修中"
          : "";
    }
    return res.send({
      data: resdb.data,
    });
  }
  //维修单状态确认领取
  if (req.query.type === "WXDZTQRLQ") {
    //修改维修单状态（验证）
    let sql_1 =
      "UPDATE `sys_maintain` set Now_Status=2,Maintain_User='" +
      req.query.Maintain_User +
      "' where Repair_Order='" +
      req.query.N_dan +
      "'";
    let resdb_1 = await mysqli(sql_1);
    let sql =
      "SELECT *,DATE_FORMAT(Create_Time,'%Y-%m-%d %T') FROM `sys_maintain` WHERE Repair_Order='" +
      req.query.N_dan +
      "'";
    let resdb = await mysqli(sql);
    return res.send({
      status: 200,
      data: resdb.data,
    });
  }
  return res.send({
    "?嗯?!?": "??????????????????????????????????????",
  });
};

/**
 * 系统查询 用户，字典, 角色
 * 系统通知信息，日志，登录日志
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.sys_select = async (req, res) => {
  //
  //获取系统通知信息
  if (req.query.type === "HQXTTZXX") {
    let sql =
      "SELECT *,DATE_FORMAT(CreateTime,'%Y-%m-%d %T') as CreateTime FROM `Sys_notice_consult` WHERE N_UserID='" +
      req.query.UserNumber +
      "' order by CreateTime desc";
    let resdb = await mysqli(sql);
    let brr = [];
    let k = 1;
    for (const i in resdb.data) {
      let arr = {};
      let sql1 =
        "SELECT * FROM `sys_maintain` WHERE Repair_Order='" +
        resdb.data[i].N_from +
        "'";
      let resdb1 = await mysqli(sql1);
      // console.log(arr);
      if (resdb1.data.length > 0) {
        arr.N_from = resdb1.data[0].Dispatcher; //来源用户
      }
      let sql2 =
        "SELECT * FROM `Sys_notice` WHERE N_Type='" +
        resdb.data[i].N_Type +
        "'";
      let resdb2 = await mysqli(sql2);
      if (resdb2.data.length > 0) {
        arr.N_msge = resdb2.data[0].N_Msg; //通知信息
      }
      arr.N_Type = "送修单"; //通知类型
      arr.N_dan = resdb.data[i].N_from; //维修单号
      arr.CreateTime = resdb.data[i].CreateTime; //通知时间
      arr.N_Read = resdb.data[i].N_Read; //通知查阅状态
      arr.ID = k++;
      brr.push(arr);
    }
    return res.send({
      data: brr,
    });
  }
  //查询系统日志
  else if (req.query.type === "HQXTRZ") {
    let sql =
      "select *,DATE_FORMAT(oper_time,'%Y-%m-%d %T') as Create_Time, (@i:=@i+1) index_i from Sys_log ,(SELECT @i:=0) as i ORDER BY oper_time desc";
    let resdb = await mysqli(sql);
    return res.send({
      data: resdb.data,
    });
  }
  //查询登录日志
  else if (req.query.type === "HQDLRZ") {
    let sql =
      "select *,DATE_FORMAT(oper_time,'%Y-%m-%d %T') as Create_Time, (@i:=@i+1) index_i from Sys_log ,(SELECT @i:=0) as i where oper_api='/login' ORDER BY oper_time desc";
    let resdb = await mysqli(sql);
    return res.send({
      data: resdb.data,
    });
  }
  //查询字典信息
  else if (req.query.type === "HQXTZDXX") {
    let sql =
      "select *,DATE_FORMAT(Create_Time,'%Y-%m-%d %T') as Create_Time, (@i:=@i+1) index_i from sys_dict_data ,(SELECT @i:=0) as i where Dict_Status>0 ORDER BY Create_Time desc";
    let resdb = await mysqli(sql);
    for (const i in resdb.data) {
      resdb.data[i].Dict_Status = "正常";
    }
    return res.send({
      data: resdb.data,
    });
  }
  //查询用户信息
  else if (req.query.type === "HQXTYHXX") {
    let sql = "select * from sys_user where UserStatus=1";
    let resdb = await mysqli(sql);
    for (const i in resdb.data) {
      let sql_1 =
        "SELECT Department FROM `Sys_role_msg` WHERE UserNumber='" +
        resdb.data[i].UserNumber +
        "'";
      let resdb_1 = await mysqli(sql_1);
      // console.log(resdb_1);
      resdb.data[i].user_status = "正常";
      if (resdb_1.data.length != 0)
        resdb.data[i].Dept_ID = resdb_1.data[0].Department;
    }
    return res.send({
      data: resdb.data,
    });
  }
  //查询角色信息
  else if (req.query.type === "HQXTJSXX") {
    let sql = "select * from Sys_role_msg where Status=1";
    let resdb = await mysqli(sql);
    for (const i in resdb.data) {
      resdb.data[i].rolestatus = "正常";
    }
    return res.send({
      data: resdb.data,
    });
  }
  return res.send({
    "?嗯?!?": "??????????????????????????????????????",
  });
};
/**
 * 新增、修改、用户信息
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.user_xzxg = async (req, res) => {
  const tokenkey = req.data.UserNumber;
  if (req.body.params.type === "edituser") {
    let sql1 =
      "UPDATE sys_user SET `UserGrade`=" +
      req.body.params.subdata +
      " WHERE UserNumber='" +
      tokenkey +
      "'";
    const resdb1 = await mysqli(sql1);
    return res.send({
      status: 200,
      message: "修改成功！",
    });
  }
  if (req.body.params.type === "edituser22") {
  }
  return res.send({
    "?嗯?!?": "??????????????????????????????????????",
  });
};

/**
 * 新增、修改、页面菜单信息
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.menu_xzxg = async (req, res) => {
  if (req.body.params.type === "addmenu") {
    let sql = "select max(id) as id from sys_menu ";
    const resdb = await mysqli(sql);
    let menuid = resdb.data[0].id;
    // console.log(menuid);
    // let maxid = resdb1.data[0].ID + 1
    let sql1 =
      "INSERT INTO `sys_menu` (`id`, `MenuName`, `MenuType`, `Authority`, `MenuNowURL`, `MenuURL`, `MenuIcon`, `Sort_Menu`, `MenuRemark`, `MenuStatus`, `CreateUser`) VALUES ('" +
      ++menuid +
      "', '" +
      req.body.params.subdata.input1 +
      "', '" +
      req.body.params.subdata.ziMenuType +
      "', '" +
      req.body.params.subdata.input3 +
      "', '" +
      req.body.params.subdata.input4 +
      "', '" +
      req.body.params.subdata.inputurl +
      "', '" +
      req.body.params.subdata.MenuIcon +
      "', '" +
      req.body.params.subdata.input2 +
      "', '" +
      req.body.params.subdata.MenuRemark +
      "', '" +
      req.body.params.subdata.input5 +
      "', '" +
      req.body.params.UserNumber +
      "')";
    const resdb1 = await mysqli(sql1);
    return res.send({
      status: 200,
      message: "增加成功！",
    });
  }
  if (req.body.params.type === "editmenu") {
    let sql1 =
      "UPDATE sys_menu SET `MenuName`='" +
      req.body.params.subdata.MenuName +
      "',`MenuType`='" +
      req.body.params.subdata.MenuType +
      "',`Authority`='" +
      req.body.params.subdata.Authority +
      "',`MenuNowURL`='" +
      req.body.params.subdata.input4 +
      "',`MenuURL`='" +
      req.body.params.subdata.MenuURL +
      "',`MenuIcon`='" +
      req.body.params.subdata.MenuIcon +
      "',`Sort_Menu`=" +
      req.body.params.subdata.Sort_Menu +
      ",`MenuRemark`='" +
      req.body.params.subdata.MenuRemark +
      "',`MenuStatus`='" +
      req.body.params.subdata.input5 +
      "' WHERE id=" +
      req.body.params.subdata.id +
      "";
    const resdb1 = await mysqli(sql1);
    return res.send({
      status: 200,
      message: "修改成功！",
    });
  }
  return res.send({
    "?嗯?!?": "??????????????????????????????????????",
  });
};
exports.menu_del = async (req, res) => {
  // console.log(req.query);
  if (req.query.type === "delmenu") {
    let sql =
      "UPDATE sys_menu SET MenuStatus=-1 WHERE id=" + req.query.delid + "";
    const resdb = await mysqli(sql);
    return res.send({
      status: 200,
      message: "删除成功！",
    });
  }
  return res.send({
    "?嗯?!?": "??????????????????????????????????????",
  });
};
//excel表提交
exports.postexcelsub = async (req, res) => {
  //excel表提交
  //角色信息导入
  if (req.body.params.type === "JSXXDR") {
    let sql1 = "select max(ID) as ID from Sys_role_msg";
    const resdb1 = await mysqli(sql1);
    let maxid = resdb1.data[0].ID + 1;
    const de = "有线及视能生产部";
    // console.log('req.body.params', req.body.params.type);
    // console.log('req.body.params.params.length', req.body.params.params);
    let sql =
      "INSERT INTO `Sys_role_msg` (`ID`, `UserNumber`, `UserName`, `Sex`, `Role_Type`, `Department`, `Dept`, `RoleClass`, `Status`, `Remark`) VALUES ";
    if (
      req.body.params.params !== undefined &&
      req.body.params.params.length === 100
    ) {
      for (let i = 0; i < req.body.params.params.length; i++) {
        let strs =
          "('" +
          maxid++ +
          "', '" +
          req.body.params.params[i].UserNumber +
          "', '" +
          req.body.params.params[i].UserName +
          "', '" +
          req.body.params.params[i].Sex +
          "', '" +
          req.body.params.params[i].Role_Type +
          "', '" +
          req.body.params.params[i].Department +
          "', '" +
          de +
          "', '暂无', '1',''),";
        sql = sql + strs;
      }
      sql = sql.substring(0, sql.length - 1);
    }
    //小于100条数据处理
    if (
      req.body.params.params !== undefined &&
      req.body.params.params.length < 100
    ) {
      // console.log('123req.body.params.params.length', req.body.params.params.length);
      for (let i = 0; i < req.body.params.params.length; i++) {
        let strs =
          "('" +
          maxid++ +
          "', '" +
          req.body.params.params[i].UserNumber +
          "', '" +
          req.body.params.params[i].UserName +
          "', '" +
          req.body.params.params[i].Sex +
          "', '" +
          req.body.params.params[i].Role_Type +
          "', '" +
          req.body.params.params[i].Department +
          "', '" +
          de +
          "', '暂无', '1',''),";
        sql = sql + strs;
      }
      sql = sql.substring(0, sql.length - 1);
    }
    const resdb = await mysqli(sql);
    // console.log(resdbcf.data.length);
    return res.send({
      status: 200,
      message: "成功",
      // data: req.body.params
    });
  }

  return res.send({
    "?嗯?!?": "??????????????????????????????????????",
  });
};
