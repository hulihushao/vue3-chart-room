// 导入
const fs = require("fs");
const path = require("path");

function write(value,callback) {
  //1.读取data.json文件
  let dir = path.join("./data", "user.json");
  fs.readFile(dir, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);
    //2.将字符串数据转变成数组格式
    let arr = JSON.parse(data);
    // console.log(arr);
    let obj = {userId:arr.length+1,...value};
    //2.1.给数组添加元素
    arr.push(obj);
    let newArr = JSON.stringify(arr); //将数组转成json格式
    // console.log(newArr);
    //3.写入需要的文件当中
    fs.writeFile(dir, newArr, "utf8", (err) => {
      console.log("写入成功", err);
    });
    if(typeof callback =="function")callback(obj)
  });
}

module.exports = { write };
