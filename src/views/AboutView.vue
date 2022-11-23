<script setup lang="ts" name="about">
//store
import { useCounter } from "@/stores/counter.js";

import axios from 'axios'
import { stateType } from "@/types/state";
import { ref, watchEffect } from "vue";
import { ElMessage } from "element-plus";
interface mutationType {}
let Counter = useCounter();
Counter.$subscribe((mutation: mutationType, state: stateType) => {
  //alert(JSON.stringify(state));
  console.log(mutation,state)
});
let ad=ref(0)
let add=()=>{
  ad.value++
  Counter.counter++
  ElMessage({
  showClose: true,
  message: "恭喜你，这是一条成功消息"+ad.value,
  type: "success",
});
}
watchEffect(()=>{
ad.value
})
let textarea = ref<string>("");
let inputValue = ref("Q");
let link = ref("");
let socket = null;
//WebSocket
let resetLink = () => {
  link.value = "正在重置...";
  if (socket) {
    socket.close();
    socket = null;
  } else {
    link.value = "正在连接...";
  }
  socket = new WebSocket("ws://192.168.241.2:8080");
  socket.addEventListener("open", function () {
    link.value = "连接服务器成功";
  });
  socket.addEventListener("message", function (e: any) {
    textarea.value = e.data;
  });
  socket.onerror = (error: any) => {
    link.value = error.data;
  };
  socket.onclose = () => {
    link.value = "连接已关闭";
  };
};
resetLink();
let send = () => {
  
  socket.send(inputValue.value);
};
let getData=()=>{
  axios.get("/api/data").then(res=>{
    textarea.value=JSON.stringify(res.data)
  }).catch(err=>{
    textarea.value=err
  })
}
let insertData=()=>{
  axios.post("/api/insert",{
    userName:"test",
    pwd:"test"
  },{
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    }
  }).then(res=>{
    textarea.value=JSON.stringify(res.data)
  }).catch(err=>{
    textarea.value=err
  })
}
</script>
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="add()">
      {{ "counter:" + Counter.counter+",ad："+ad }}
    </button>
    <el-button type="primary" @click="send">发送</el-button>
    <el-button type="primary" @click="resetLink">重置连接</el-button>
    <el-button type="primary" @click="getData">获取数据</el-button>
    <el-button type="primary" @click="insertData">插入数据</el-button>
    <el-input v-model="inputValue" />
    <div>{{ link }}</div>
    <span v-html="textarea"></span>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
