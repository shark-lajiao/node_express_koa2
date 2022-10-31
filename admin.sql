/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80031 (8.0.31-0ubuntu0.20.04.1)
 Source Host           : localhost:3306
 Source Schema         : admin

 Target Server Type    : MySQL
 Target Server Version : 80031 (8.0.31-0ubuntu0.20.04.1)
 File Encoding         : 65001

 Date: 31/10/2022 17:34:21
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for adminInfo
-- ----------------------------
DROP TABLE IF EXISTS `adminInfo`;
CREATE TABLE `adminInfo` (
  `UserId` int NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `realName` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `desc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

-- ----------------------------
-- Table structure for login
-- ----------------------------
DROP TABLE IF EXISTS `login`;
CREATE TABLE `login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(255) NOT NULL COMMENT '账户',
  `passwrold` varchar(255) NOT NULL COMMENT '密码',
  `jurisdiction` int NOT NULL DEFAULT '0' COMMENT '权限',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf32;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `uid` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `userName` varchar(255) DEFAULT NULL COMMENT '用户名',
  `userype` varchar(255) DEFAULT NULL COMMENT '权限',
  `userAvatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `userEmail` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `userPhone` int DEFAULT NULL COMMENT '手机号码',
  `user` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf32;

-- ----------------------------
-- Table structure for tabel
-- ----------------------------
DROP TABLE IF EXISTS `tabel`;
CREATE TABLE `tabel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `beginTime` datetime DEFAULT NULL,
  `endTime` datetime DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1102 DEFAULT CHARSET=utf32;

SET FOREIGN_KEY_CHECKS = 1;
