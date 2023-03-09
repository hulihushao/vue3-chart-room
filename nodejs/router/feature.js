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
router.post("/insertPoint",(req,res)=>{
  console.log(req.body)
  let featureData=require("../data/features.json")
  let {xy}=req.body
  let id=featureData.features.length+1
  let data={
      "geometry": {
        "coordinates": xy.split(","),
        "type": "Point"
      },
      "id": "MAPPOINT."+id,
      "geometry_name": "Pnt",
      "type": "Feature",
      "properties": {
        ...req.body,
        "id": id,
        "mpLayer": "0",
      }
    }
    write(data,(arr)=>{
      arr.features.push(data)
      return {arr,obj:data}
    },(newData)=>{
      res.send({
        code:200,
        data:newData
      })
    })
})
// 导出
module.exports = router;
