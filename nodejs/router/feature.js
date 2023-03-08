// category路由文件
const express = require("express");
const router = express.Router();

router.get("/features", (req, res) => {
  let featureData = require("../data/features.json");
  console.log(featureData)
      res.send({
        code: 200,
        data:featureData,
      })
});
// 导出
module.exports = router;
