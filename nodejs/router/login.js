// category路由文件
const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  console.log(req.body);
  let { userName, pwd } = req.body
  let userData = require("../data/user.json");
  let one = userData.filter((item) => item.userName == userName);
  if (one.length) {
    if (one[0].pwd == pwd) {
      res.send({
        code: 200,
        data: one,
      });
    }else{
        res.send({
        code: 500,
        data:"密码错误",
      })
    }
  }else{
      res.send({
        code: 404,
        data: "用户不存在",
      })
  }
});
// 导出
module.exports = router;
