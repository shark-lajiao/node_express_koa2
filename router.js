/*
 * @Author: Undecimber 2059085250@qq.com
 * @Date: 2022-08-01 09:24:02
 * @LastEditors: Undecimber 2059085250@qq.com
 * @LastEditTime: 2022-09-30 17:01:06
 * @FilePath: \server\router.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
let express = require("express");
let router = express.Router();
let list = require("./API/list");
let test = require("./API/test");
let dashboard = require("./API/dashboard");
const multiparty = require("multiparty");
router.get("/test", test.test); //测试
router.post("/login", list.login); //登录验证
// router.post("/imgUpload", list.upload.array("img", 1), list.imgUpload); //图片上传
router.get("/dashboard", dashboard.data); //仪表盘数据
router.post("/admin_info", list.getusermsg); //获取用户信息
router.get("/gethomedata", list.gethomedata); //主页数据统计
router.get("/getinitmenu", list.getinitmenu); //获取基础菜单信息
router.get("/initnotice", list.initnotice); //获取通知列表

let sysadmin = require("./API/sysadmin");
router.post("/menu_xzxg", sysadmin.menu_xzxg); //新增、修改、页面菜单信息
router.post("/user_xzxg", sysadmin.user_xzxg); //新增、修改、用户信息
router.post("/postexcelsub", sysadmin.postexcelsub); //excel表提交
router.get("/sys_select", sysadmin.sys_select); //系统查询，用户，字典信息

router.get("/menu_del", sysadmin.menu_del); //删除菜单
router.get("/notice_select", sysadmin.notice_select); //查看各种通知

//上传个人头像图片
router.post("/upload/headImage", function (req, res, next) {
  let form = new multiparty.Form();
  form.uploadDir = "./public/images";
  // form.keepExtensions=true;   //是否保留后缀
  form.parse(req, function (err, fields, files) {
    //其中fields表示你提交的表单数据对象，files表示你提交的文件对象
    console.log(req);
    console.log(fields, files);
    if (err) {
      res.json({
        status: "1",
        msg: "上传失败！" + err,
      });
    } else {
      res.json({
        status: "0",
        msg: "上传成功！",
        imgSrc: files.image,
      });
    }
  });
});
module.exports = router;
