//导入express
const express = require("express");

let { write } = require("./fileWrite");
//创建web服务器
const app = express();
//配置解析表单数据(application/x-www-form-urlencoded)格式的中间件
app.use(express.urlencoded({ extended: true }));

const login =require("../router/login")
app.use("",login)

//get接口的开发
app.get("/data", (err, res) => {
  let userData=require("../data/user.json")
  console.log(userData)
  res.send({
    code: 200,
    data: userData,
  });
});

app.post("/insert", (req, res) => {
  let newList = req.body;
  console.log(newList);
  write(newList, (newData) => {
    res.send({
      code: 200,
      data:newData,
    });
  });
});

module.exports = app;
