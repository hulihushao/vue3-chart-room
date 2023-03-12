<script setup lang="ts">
import moment from "moment";
import { ref, watchEffect, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useWebSocket, useSend, useOnMessage } from "../hooks/useWebSocket.js";
let menuList = ref<object[]>([]);

let textarea = ref("");
let chatType = ref(0);
let bridge = ref([]);
let uid = ref(1);
let users = ref([]);
let title = ref("");
let WebSocket = ref(null);
let userInfo={}
//let currentMessage = ref([]);
let messageList = ref([
  {
    type: 1,
    name: "qq",
    msg: "siisjd",
    date: moment().format("YYYY-MM-DD HH:mm:ss"),
    nickname: "ee",
    bridge: [],
  },
  {
    uid: 1,
    type: 2,
    name: "qq",
    msg: "sjd",
    date: moment().format("YYYY-MM-DD HH:mm:ss"),
    nickname: "122e",
    bridge: [1, 2],
  },
  {
    uid: 2,
    type: 2,
    name: "qq",
    msg: "sjd",
    date: moment().format("YYYY-MM-DD HH:mm:ss"),
    nickname: "122e",
    bridge: [1, 2],
  },
]);

interface messageItem {
  usertype: number;
  uid: number;
  nickname: string;
}
let clickMenu = (value: messageItem) => {
  if (!value.usertype) return;

  chatType.value = value.usertype;
  title.value = value.nickname;
  if (value.usertype == 1) {
    bridge.value = [];
  } else if (value.usertype == 2) {
    bridge.value = [uid.value, value.uid];
  }
  /**currentMessage.value = messageList.value.filter(
    (item) => item.bridge.sort().join("") == bridge.value.sort().join("")
  );*/
};

let currentMessage = computed(() => {
  return messageList.value.filter(
    (item) => item.bridge.sort().join("") == bridge.value.sort().join("")
  );
});
let usersList = computed(() => {
  if(!menuList.value.length)return users.value
  let index =users.value.findIndex(item=>item.nickname+"(YOU)"==menuList.value[0].nickname)
  users.value.splice(index,1)
  users.value.unshift(menuList.value[0]);
  return users.value
});
onMounted(() => {
  let u = localStorage.getItem("userInfo");
  if (u) {
    userInfo=JSON.parse(u)
    uid.value=userInfo.uid
    menuList.value.unshift({
      nickname: JSON.parse(u).nickname + "(YOU)",
    });
    WebSocket.value = useWebSocket(messageList, users, {
      ...JSON.parse(u),
      type: 1,
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
      users: users.value,
      msg: textarea.value,
      bridge: bridge.value,
    });
    return;
  }
  ElMessageBox.prompt("请输入昵称", "提示", {
    confirmButtonText: "确定",
    showCancelButton: false,
    closeOnClickModal: false,
    inputValidator: (value) => {
      let some = menuList.value.some((item) => item.nickname == value);
      if (!value) return "请输入昵称!";
      if (some) return "昵称已存在!";
    },
  }).then(({ value }) => {
    let user = {
      uid: menuList.value.length + "1"+Math.random()*100000,
      nickname: value,
      usertype: 2,
    };
        uid.value=user.uid
    localStorage.setItem("userInfo", JSON.stringify(user));
    menuList.value.unshift({
      nickname: value + "(YOU)",
    });
    WebSocket.value = useWebSocket(messageList, users, {
      ...user,
      type: 1,
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
      users: users.value,
      msg: textarea.value,
      bridge: bridge.value,
    });
    ElMessage({
      type: "success",
      message: `用户创建成功!`,
    });
  });
});
let submit=()=>{
  useSend(WebSocket,{
      ...userInfo,
      type: 2,
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
      users: users.value,
      msg: textarea.value,
      bridge: bridge.value,
    })
    textarea.value=""
}
let removeUserInfo=()=>{
  localStorage.removeItem("userInfo")
  location.reload()
}
</script>

<template>
  <div id="chat-container">
    <aside class="menu">
      <h3>聊天列表</h3>
      <p
        v-for="item in usersList"
        :key="item.nickname"
        @click="clickMenu(item)"
        :class="{ active: bridge[1] == item.uid&&chatType==item.usertype }"
      >
        {{ item.nickname }}
      </p>
      <button @click="removeUserInfo">清除用户信息</button>
    </aside>
    <main class="main-body" v-if="chatType == 0">
      <p class="no-chat">暂无内容</p>
    </main>
    <main class="main-body" v-else>
      <p class="title">{{ title }}</p>
      <div style="border-bottom: 1px solid #ccc" />
      <div class="text-body">
        <div
          style="margin: 5px 0"
          :class="{ user: item.uid == uid }"
          v-for="item in currentMessage"
          :key="item.date"
        >
          <span v-if="item.type === 1">
            <p class="join-tips">{{ item.msg }}</p>
            <p class="join-tips">{{ item.date }}</p>
          </span>
          <span v-else>
            <p class="message-date">
              <span class="m-nickname">{{ item.nickname }}</span>
              {{ item.date }}
            </p>
            <div class="message-box">
              <span
                :style="{ background: item.uid == 1 ? '#79D289' : '#eee' }"
                >{{ item.msg }}</span
              >
            </div>
          </span>
        </div>
      </div>
      <footer class="send">
        <el-input
          v-model="textarea"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 3 }"
          rows="3"
          placeholder="请输入内容"
        />
        <el-button type="primary" @click="submit">发送</el-button>
      </footer>
    </main>
  </div>
</template>
<style lang="less" scoped>
#chat-container {
  height: 100%;
  width: 100%;
  display: flex;
  border: 1px solid #ccc;
  .menu {
    width: 35%;
    height: 100%;
    border: 1px solid #eee;
    overflow: auto;
    .active {
      background: #409eff;
      transition: all 0.3s;
      color: #fff;
    }
    h3 {
      text-align: center;
      border-bottom: 1px solid #ccc;
    }
    p {
      line-height: 25px;
      border-bottom: 1px solid #ccc;
      padding: 2px 5px;
    }
  }
  .main-body {
    flex: 1;
    height: 500px;
    border: 1px solid red;
    display: flex;
    flex-direction: column;
    .no-chat {
      text-align: center;
      line-height: 500px;
      color: #ccc;
    }
    .title {
      text-align: center;
    }
    .text-body {
      flex: 1;
      padding: 0 5px;
      .user {
        text-align: right;
      }
      .join-tips {
        text-align: center;
        color: #ccc;
        font-size:12px;
        line-height:12px;
      }
      .m-nickname {
        color: #409eff;
      }
      .message-box {
        font-size: 20px;
        width: 100%;
        span {
          border-radius: 5px;
          background: #eee;
          padding: 5px 10px;
        }
      }
    }
    .send {
      display: flex;
      border-top: 1px solid #ccc;
      height: 65px;
      align-items: center;
    }
  }
}
</style>
