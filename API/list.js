/*
 * @Author: Undecimber 2059085250@qq.com
 * @Date: 2022-08-01 09:24:02
 * @LastEditors: Undecimber 2059085250@qq.com
 * @LastEditTime: 2022-09-30 17:02:57
 * @FilePath: \server\util\token.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { db, mysqli } = require("../db/index");
// const { Myerror } = require('../util/util')
const tokens = require("../util/token");
// 引入multer
const multer = require("multer");

// 上传图片的方法
const storage = multer.diskStorage({
  // 存储位置
  destination: function (req, file, callback) {
    console.log(file);
    // 参数解释 param1:错误信息  param2:上传图片的服务端保存路径，注意这里的路径写法
    callback(null, "./assets/images/");
  },
  // 确定文件名,在这儿采用了时间戳和图片文件原名为上传的图片文件命名，可以保证名字不重复
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
// 得到multer对象
exports.upload = multer({ storage: storage });

exports.imgUpload = (req, res) => {
  // 返回图片的地址
  let file = req.files;
  console.log(file[0]);
  //====此时，图片已经保存至我们的服务端了====
  let fileInfo = {};
  // 获取文件基本信息，封装好发送给前端
  fileInfo.type = file[0].mimetype;
  fileInfo.name = file[0].originalname;
  fileInfo.size = file[0].size;
  fileInfo.path = "/images/" + file[0].filename;
  res.send({
    code: 200,
    value: "图片上传成功",
    data: fileInfo,
  });
};
//登录
exports.login = async (req, res) => {
  //登录
  // try {
  /**--------------------------------------------- */
  // console.log(6666);
  let resData = {
    account: req.body.username,
    pwd: req.body.password,
  };
  let sql = "select * from login";
  const resdb = await mysqli(sql, resData.account);
  // console.log(resdb, "数据库查询结果"); //数据库查询结果 ;
  if (resdb === undefined) {
    return res.send({
      code: 501,
      message: "数据库连接错误!",
    });
  }
  let sublog = {
    UserName: "未知",
  };
  if (resdb.data.length > 0) {
    sublog.UserName = resdb.data[0].UserName;
  }
  if (req.body.username === resdb.data[0].user) {
    const token = await tokens.setToken(sublog.UserName);
    console.log(token);
    return res.send({
      code: 200,
      token,
      message: req.body.username,
    });
  } else {
    return res.send({
      code: 401,
      message: "用户名或密码错误!",
    });
  }

  // console.log('token', req);

  // if (resdb.data.length != 0) {
  //   /**系统日志 */
  //   let sup = { Dept_ID: "" };
  //   let sql_123 =
  //     "SELECT * FROM `Sys_role_msg` WHERE UserNumber='" +
  //     req.body.UserNumber +
  //     "' and Status=1"; //查询用户信息
  //   const resdb_123 = await mysqli(sql_123); //科室
  //   if (resdb_123.data.length > 0) {
  //     sup.Dept_ID = resdb_123.data[0].Department;
  //   }
  //   let sql_log_maxid = "select max(ID) as ID from Sys_log";
  //   const resdb_log_maxid = await mysqli(sql_log_maxid);
  //   let sql_log =
  //     "INSERT INTO `Sys_log` (`ID`, `log_title`, `oper_type`, `oper_user`, `oper_param`, `oper_api`, `res_json`, `oper_status`, `oper_location`, `oper_ip`,`dept_name`) VALUES " +
  //     "(" +
  //     ++resdb_log_maxid.data[0].ID +
  //     ",'用户登录','登录成功','" +
  //     (sublog.UserName + req.body.params.UserNumber) +
  //     "','" +
  //     req.body.params.UserNumber +
  //     "','/login','{status: 200,message: 欢迎登录}',1,'XX XX','0.0.0.0','" +
  //     sup.Dept_ID +
  //     "')";
  //   const resdb_log = await mysqli(sql_log);
  //   /* -----------------------*/
  //   return res.send({
  //     status: 200,
  //     token,
  //     message: "欢迎登录~ " + resdb.data[0].UserName,
  //   });
  // } else {
  //   let sql1 = "select max(UserID) as UserID from sys_user";
  //   const resdb1 = await mysqli(sql1);
  //   // console.log('resdb1', resdb1.data);
  //   let date = new Date().format("yy-MM-dd hh:mm:ss");
  //   const pass = await tokens.setToken(req.body.UserPassword);
  //   let sqluser =
  //     "SELECT * FROM `Sys_role_msg` WHERE UserNumber='" +
  //     req.body.UserNumber +
  //     "'";
  //   const resdbuser = await mysqli(sqluser);
  //   console.log(resdbuser, "resdbuser");
  //   if (resdbuser === undefined) {
  //     return res.send({
  //       status: 501,
  //       message: "数据库连接错误!",
  //     });
  //   }
  //   let username = "";
  //   if (resdbuser.data.length > 0) {
  //     username = resdbuser.data[0].UserName;
  //   }
  //   let rqdata = [
  //     resdb1.data[0].UserID + 1,
  //     username,
  //     0,
  //     req.body.params.UserNumber,
  //     pass,
  //     3,
  //     1,
  //     date,
  //     "普通用户",
  //     token,
  //     date,
  //   ];
  //   // console.log('resdb1', rqdata);
  //   let sql2 = "insert into sys_user values(?,?,?,?,?,?,?,?,?,?,?)";
  //   const resdb2 = await mysqli(sql2, rqdata);
  //   // console.log('resdb2', resdb2);
  //   if (username === "") {
  //     username = req.body.params.UserNumber;
  //   }

  //   /**系统日志 */
  //   let sup = { Dept_ID: "" };
  //   let sql_123 =
  //     "SELECT * FROM `Sys_role_msg` WHERE UserNumber='" +
  //     req.body.params.UserNumber +
  //     "' and Status=1"; //查询用户信息
  //   const resdb_123 = await mysqli(sql_123); //科室
  //   if (resdb_123.data.length > 0) {
  //     sup.Dept_ID = resdb_123.data[0].Department;
  //   }
  //   let sql_log_maxid = "select max(ID) as ID from Sys_log";
  //   const resdb_log_maxid = await mysqli(sql_log_maxid);
  //   let sql_log =
  //     "INSERT INTO `Sys_log` (`ID`, `log_title`, `oper_type`, `oper_user`, `oper_param`, `oper_api`, `res_json`, `oper_status`, `oper_location`, `oper_ip`,`dept_name`) VALUES " +
  //     "(" +
  //     ++resdb_log_maxid.data[0].ID +
  //     ",'用户登录','首次登录','" +
  //     (sublog.UserName + req.body.params.UserNumber) +
  //     "','" +
  //     req.body.params.UserNumber +
  //     "','/login','{status: 200,message: 欢迎首次登录系统}',1,'XX XX','0.0.0.0','" +
  //     sup.Dept_ID +
  //     "')";
  //   const resdb_log = await mysqli(sql_log);
  //   /* -----------------------*/
  //   return res.send({
  //     status: 200,
  //     token,
  //     message: "欢迎首次登录系统~ " + username,
  //   });
  // }
  /**--------------------------------------------- */
  // let url = "http://apimes.sc.zte.com.cn/zte-mes-manufactureshare-centerfactory/user/ucs/login"
  // let resData = {
  //     account: req.body.params.UserNumber,
  //     pwd: req.body.params.UserPassword
  // }
  // request2({
  //     url: url,
  //     method: "POST",
  //     json: true,
  //     headers: {
  //         "content-type": "application/json"
  //     },
  //     body: resData
  // }, async function(error, response, body) {
  //     if (error) {
  //         return res.send({
  //             status: 501,
  //             message: "登录失败，工号不存在或者密码错误~"
  //         })
  //     }
  //     if (!error) {
  //         // console.log(456);
  //         if (body.code.code === '0004') {
  //             // console.log(0004);
  //             // console.log(body);
  //             return res.send({
  //                 status: 501,
  //                 message: "登录失败，工号不存在或者密码错误~"
  //             })
  //         }
  //         if (body.code.code === '0000') {
  //             let sql = 'select UserNumber,UserName from sys_user where UserNumber=?'
  //             const resdb = await mysqli(sql, resData.account)
  //             const token = jwt.sign({
  //                 id: req.body.params.UserNumber
  //             }, loginjwtkey, { expiresIn: 60 * 60 * 24 * 365 });
  //             // console.log('resdb', resdb);
  //             if (resdb === undefined) {
  //                 return res.send({
  //                     status: 501,
  //                     message: "数据库连接错误!"
  //                 })
  //             }
  //             if (resdb.data.length != 0) {
  //                 /**系统日志 */
  //                 let sup = { Dept_ID: "" }
  //                 let sql_123 = "SELECT * FROM `Sys_role_msg` WHERE UserNumber='" + req.body.params.UserNumber + "' and Status=1" //查询用户信息
  //                 const resdb_123 = await mysqli(sql_123) //科室
  //                 if (resdb_123.data.length > 0) {
  //                     sup.Dept_ID = resdb_123.data[0].Department
  //                 }
  //                 let sql_log_maxid = "select max(ID) as ID from Sys_log"
  //                 const resdb_log_maxid = await mysqli(sql_log_maxid)
  //                 let sql_log = "INSERT INTO `Sys_log` (`ID`, `log_title`, `oper_type`, `oper_user`, `oper_param`, `oper_api`, `res_json`, `oper_status`, `oper_location`, `oper_ip`,`dept_name`) VALUES " +
  //                     "(" + (++resdb_log_maxid.data[0].ID) + ",'用户登录','登录成功','" + (resdb.data[0].UserName + req.body.params.UserNumber) + "','" + req.body.params.UserNumber + "','/login','{status: 200,message: 欢迎登录}',1,'XX XX','0.0.0.0','" + sup.Dept_ID + "')"
  //                 const resdb_log = await mysqli(sql_log)
  //                     /* -----------------------*/
  //                 return res.send({
  //                     status: 200,
  //                     token,
  //                     message: "欢迎登录~ " + resdb.data[0].UserName
  //                 })
  //             } else {
  //                 let sql1 = 'select max(UserID) as UserID from sys_user'
  //                 const resdb1 = await mysqli(sql1)
  //                     // console.log('resdb1', resdb1.data);
  //                 let date = new Date().format("yy-MM-dd hh:mm:ss");
  //                 const pass = jwt.sign({
  //                     pass: req.body.params.UserPassword
  //                 }, loginjwtkey, { expiresIn: 3600 * 24 * 365 })

  //                 let sqluser = "SELECT * FROM `Sys_role_msg` WHERE UserNumber='" + req.body.params.UserNumber + "'"
  //                 const resdbuser = await mysqli(sqluser);
  //                 if (resdbuser === undefined) {
  //                     return res.send({
  //                         status: 501,
  //                         message: "数据库连接错误!"
  //                     })
  //                 }
  //                 let username = '';
  //                 if (resdbuser.data.length > 0) {
  //                     username = resdbuser.data[0].UserName
  //                 }
  //                 let rqdata = [resdb1.data[0].UserID + 1, username, 0, req.body.params.UserNumber,
  //                         pass, 3, 1, date, '普通用户', token, date
  //                     ]
  //                     // console.log('resdb1', rqdata);
  //                 let sql2 = "insert into sys_user values(?,?,?,?,?,?,?,?,?,?,?)"
  //                 const resdb2 = await mysqli(sql2, rqdata)
  //                     // console.log('resdb2', resdb2);
  //                 if (username === '') {
  //                     username = req.body.params.UserNumber;
  //                 }

  //                 /**系统日志 */
  //                 let sup = { Dept_ID: "" }
  //                 let sql_123 = "SELECT * FROM `Sys_role_msg` WHERE UserNumber='" + req.body.params.UserNumber + "' and Status=1" //查询用户信息
  //                 const resdb_123 = await mysqli(sql_123) //科室
  //                 if (resdb_123.data.length > 0) {
  //                     sup.Dept_ID = resdb_123.data[0].Department
  //                 }
  //                 let sql_log_maxid = "select max(ID) as ID from Sys_log"
  //                 const resdb_log_maxid = await mysqli(sql_log_maxid)
  //                 let sql_log = "INSERT INTO `Sys_log` (`ID`, `log_title`, `oper_type`, `oper_user`, `oper_param`, `oper_api`, `res_json`, `oper_status`, `oper_location`, `oper_ip`,`dept_name`) VALUES " +
  //                     "(" + (++resdb_log_maxid.data[0].ID) + ",'用户登录','首次登录','" + (resdb.data[0].UserName + req.body.params.UserNumber) + "','" + req.body.params.UserNumber + "','/login','{status: 200,message: 欢迎首次登录系统}',1,'XX XX','0.0.0.0','" + sup.Dept_ID + "')"
  //                 const resdb_log = await mysqli(sql_log)
  //                     /* -----------------------*/
  //                 return res.send({
  //                     status: 200,
  //                     token,
  //                     message: "欢迎首次登录系统~ " + username
  //                 })
  //             }
  //         }
  //         /**系统日志 */
  //         let sup = { Dept_ID: "" }
  //         let sql_123 = "SELECT * FROM `Sys_role_msg` WHERE UserNumber='" + req.body.params.UserNumber + "' and Status=1" //查询用户信息
  //         const resdb_123 = await mysqli(sql_123) //科室
  //         if (resdb_123.data.length > 0) {
  //             sup.Dept_ID = resdb_123.data[0].Department
  //         }
  //         let sql_log_maxid = "select max(ID) as ID from Sys_log"
  //         const resdb_log_maxid = await mysqli(sql_log_maxid)
  //         let sql_log = "INSERT INTO `Sys_log` (`ID`, `log_title`, `oper_type`, `oper_user`, `oper_param`, `oper_api`, `res_json`, `oper_status`, `oper_location`, `oper_ip`,`dept_name`) VALUES " +
  //             "(" + (++resdb_log_maxid.data[0].ID) + ",'用户登录','登录失败','" + req.body.params.UserNumber + "','" + req.body.params.UserNumber + "','/login','{status: 501,message: 登录失败，工号不存在或者密码错误~}',2,'XX XX','0.0.0.0','" + sup.Dept_ID + "')"
  //         const resdb_log = await mysqli(sql_log)
  //             /*------------------------------ */
  //         return res.send({
  //             status: 501,
  //             message: "登录失败，工号不存在或者密码错误~"
  //         })
  //     }
  // })
  // } catch (err) {
  //     throw new Myerror(40001, '请求错误');
  // }
};

//主页数据统计
exports.gethomedata = async (req, res) => {
  //主页数据
  const tokenkey = req.data.UserNumber;
  // console.log(req.query);
  if (req.query.type === "SBinit") {
    let sql = "SELECT EM_Name FROM sys_tooling_list";
    // let rqdata = [tokenkey]
    let resdb = await mysqli(sql);
    // console.log('goods', resdb.data);
    return res.send(resdb.data);
  }
  return res.send({
    "?嗯?!?": "??????????????????????????????????????",
  });
};
//获取基础菜单信息
exports.getinitmenu = async (req, res) => {
  //获取基础菜单信息
  if (req.query.type === "CSHCD") {
    let arr = [],
      brr = [],
      crr = [];
    // console.log(req.data.UserNumber);
    const tokenkey = req.data.UserNumber; //解析
    let sql_i1 =
      "SELECT UserGrade FROM sys_user WHERE UserNumber='" + tokenkey + "'";
    let resdb_i1 = await mysqli(sql_i1); //查询用户等级

    let Grade = resdb_i1.data[0].UserGrade; //等级
    if (Grade !== 1) {
      let sql_i2 =
        "SELECT * FROM `Sys_User_Right` WHERE UserGrade='" +
        Grade +
        "'  and Menu_Type='A' order by Menu_Sort";
      let resdb_i2 = await mysqli(sql_i2); //查询菜单id
      for (const i in resdb_i2.data) {
        let sql_arr =
          "SELECT * FROM sys_menu where Authority='" +
          resdb_i2.data[i].Authority +
          "'";
        let resdb_arr = await mysqli(sql_arr);
        // console.log(resdb_arr.data);
        let sql_i3 =
          "SELECT * FROM `Sys_User_Right` WHERE UserGrade=" +
          Grade +
          " and Menu_Type='B' and Authority like '%" +
          resdb_i2.data[i].Authority +
          "%' order by Menu_Sort";
        let resdb_i3 = await mysqli(sql_i3);
        resdb_arr.data[0]["onesubmenu"] = [];
        for (const j in resdb_i3.data) {
          let sql_brr =
            "SELECT * FROM sys_menu where Authority='" +
            resdb_i3.data[j].Authority +
            "'";
          let resdb_brr = await mysqli(sql_brr);
          // console.log('brr', resdb_brr.data);
          brr.push(resdb_brr.data[0]);
          let sql_i4 =
            "SELECT * FROM Sys_User_Right where UserGrade=" +
            Grade +
            " and Menu_Type='C' and Authority like '%" +
            resdb_i3.data[j].Authority +
            "%' order by Menu_Sort";
          let resdb_i4 = await mysqli(sql_i4);
          resdb_brr.data[0]["twosubmenu"] = [];
          for (const k in resdb_i4.data) {
            let sql_crr =
              "SELECT * FROM sys_menu where Authority='" +
              resdb_i4.data[k].Authority +
              "'";
            let resdb_crr = await mysqli(sql_crr);
            crr.push(resdb_crr.data[0]);
            resdb_brr.data[0]["twosubmenu"] = crr;
          }
          resdb_arr.data[0]["onesubmenu"] = brr;
          crr = [];
        }
        brr = [];
        // resdb_i2.data[i]['onesubmenu'] = resdb_i3.data
        arr.push(resdb_arr.data[0]);
      }
      // console.log(arr, brr, crr);
    } else {
      let sql =
        "SELECT * FROM sys_menu where MenuStatus>0 and MenuType='A' order by Sort_Menu";
      let resdb = await mysqli(sql);
      for (const i in resdb.data) {
        let sql1 =
          "SELECT * FROM sys_menu where MenuStatus>0 and MenuType='B' and Authority like ? order by Sort_Menu";
        let rqdata1 = "%" + resdb.data[i].Authority + "%";
        // console.log(resdb.data[i].Authority);
        let resdb1 = await mysqli(sql1, rqdata1);
        for (const j in resdb1.data) {
          let sql2 =
            "SELECT * FROM sys_menu where MenuStatus>0 and MenuType='C' and Authority like ?  order by Sort_Menu";
          let rqdata2 = "%" + resdb1.data[j].Authority + "%";
          let resdb2 = await mysqli(sql2, rqdata2);
          resdb1.data[j]["twosubmenu"] = resdb2.data;
        }
        // console.log('rqdata1' + rqdata1 + 'onesubmenu', resdb1);
        resdb.data[i]["onesubmenu"] = resdb1.data;
      }
      arr = resdb.data;
    }

    return res.send({
      homemenu: arr,
    });
  }
  if (req.query.type === "CDGL") {
    let sql =
      "SELECT * FROM sys_menu where MenuType='A' and MenuStatus>-1 order by Sort_Menu";
    let resdb = await mysqli(sql);
    for (const i in resdb.data) {
      let sql1 =
        "SELECT * FROM sys_menu where MenuType='B' and MenuStatus>-1 and Authority like ? order by Sort_Menu";
      let rqdata1 = "%" + resdb.data[i].Authority + "%";
      // console.log(resdb.data[i].Authority);
      if (resdb.data[i].MenuNowURL === "nourl") {
        resdb.data[i].newwin = "是";
      } else resdb.data[i].newwin = "否";
      let resdb1 = await mysqli(sql1, rqdata1);
      for (const j in resdb1.data) {
        let sql2 =
          "SELECT * FROM sys_menu where MenuType='C' and MenuStatus>-1 and Authority like ?  order by Sort_Menu";
        let rqdata2 = "%" + resdb1.data[j].Authority + "%";
        let resdb2 = await mysqli(sql2, rqdata2);
        if (resdb1.data[j].MenuNowURL === "nourl") {
          resdb1.data[j].newwin = "是";
        } else resdb1.data[j].newwin = "否";
        resdb1.data[j]["children"] = resdb2.data;
        if (resdb2.data.length != 0) {
          for (const k in resdb2.data) {
            if (resdb2.data[k].MenuNowURL === "nourl") {
              resdb2.data[k].newwin = "是";
            } else resdb2.data[k].newwin = "否";
          }
        }
      }
      // console.log('rqdata1' + rqdata1 + 'onesubmenu', resdb1);
      // resdb1.data[0].expanded = false
      resdb.data[i]["children"] = resdb1.data;
    }
    return res.send({
      homemenu: resdb.data,
    });
  }
};
//个人信息
exports.getusermsg = (req, res) => {
  const tokenkey = req.body.user;
  console.log("11111111111111111111111", tokenkey);
  let sql = "select * from sys_user where user=?";
  let rqdata = [tokenkey];
  console.log(rqdata, "rqdata");
  db.query(sql, rqdata, (err, data) => {
    if (err) {
      return res.send({
        code: 250,
        message: err.message,
      });
    }
    let userdata = {
      ...data[0],
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
    return res.send({
      code: 200,
      message: userdata,
    });
  });
};

//获取通知列表
exports.initnotice = async (req, res) => {
  //获取通知列表
  if (req.query.type === "HQTZLBWXD") {
    // console.log(req.query);
    let sql1 =
      "SELECT * FROM `Sys_notice_consult` WHERE N_UserID='" +
      req.query.UserNumber +
      "' AND N_Read='1'";
    let resdb1 = await mysqli(sql1);
    let sql_2, resdb_2;
    let arr = [];
    for (const i in resdb1.data) {
      sql_2 =
        "SELECT * FROM `Sys_notice` WHERE N_Type='" +
        resdb1.data[i].N_Type +
        "' AND N_Status=1";
      resdb_2 = await mysqli(sql_2); //查找通知表
      if (resdb_2.data.length > 0) {
        resdb1.data[i].n_msg = resdb_2.data[0].N_Msg;
      } else {
        resdb1.data[i].n_msg = "未知类型的通知！";
      }
    }

    return res.send({
      n_length: resdb1.data.length,
      data: resdb1.data,
    });
  }
};
Date.prototype.format = function (format) {
  var args = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
    S: this.getMilliseconds(),
  };
  if (/(y+)/.test(format))
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var i in args) {
    var n = args[i];
    if (new RegExp("(" + i + ")").test(format))
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length)
      );
  }
  return format;
};
