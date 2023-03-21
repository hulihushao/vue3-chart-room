<script setup lang="ts">
//引入
import moment from "moment";
import {
  onBeforeUnmount,
  ref,
  nextTick,
  watch,
  reactive,
  onMounted,
  computed,
} from "vue";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { useWebSocket, useSend, useOnMessage } from "../hooks/useWebSocket.js";
//聊天列表数据
let menuList = ref<object[]>([]);
//输入框数据
let textarea = ref("");
//聊天类型:群聊或单聊
let chatType = ref(0);
//和谁单聊的数组
let bridge = ref([]);
//当前用户uid
let uid = ref<number | string>(1);
//所有用户
let users = ref([]);
//聊天框顶部标题
let title = ref("");
//webSocket
let WebSocket = ref(null);
//用户信息
let userInfo = {};
//当前消息列表
let cMessage = ref([]);
//测试message用例
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
//用户信息
interface messageItem {
  usertype: number;
  uid: number;
  nickname: string;
}
//ref元素
let msgbox = ref();
//菜单列表点击
let clickMenu = (value: messageItem) => {
  if (!value.usertype) {
    chatType.value = 0;
    title.value = "";
    bridge.value=[]
    return;
  }

  chatType.value = value.usertype;
  title.value = value.nickname;
  if (value.usertype == 1) {
    bridge.value = [];
  } else if (value.usertype == 2) {
    bridge.value = [uid.value, value.uid];
  }
  //dom更新后发送数据修改消息读取状态
  nextTick(() => {
    useSend(WebSocket, {
      type: 5,
      ...userInfo,
      toUid:value.uid,
      messages: cMessage.value,
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    //滚动到底部
    msgbox.value.scrollTo({ top: 10000 });
  });
};
//监听消息列表的长度以滚动到底部
watch(
  () => messageList.value.length,
  () => {
    nextTick(() => {
      msgbox.value.scrollTo({ top: 10000 });
    });
  }
);
//获取消息未读数量，有user表示是单聊，没有表示群聊
let getMsgNum = (user: messageItem) => {
  if (user.usertype == 1) {
    // 群聊，brige为空数组，找未读消息数
    return messageList.value.filter((item) => {
      return !item.bridge.length && item.status === 1;
    }).length;
  } else {
    // 增加了uid相同判断，确认是当前聊天对应人的消息数组
    return messageList.value.filter((m) => {
      let value = [...m.bridge];
      let bridgeValue = [...bridge.value];
      return (
        m.bridge.length &&
        m.bridge.indexOf(userInfo.uid) > -1 &&
        m.status == 1 &&
        m.uid == user.uid
      );
    }).length;
  }
};
//当前消息数组
let currentMessage = computed(() => {
  let data = messageList.value.filter((item) => {
    let value = [...item.bridge];
    let bridgeValue = [...bridge.value];
    return value.sort().join("") == bridgeValue.sort().join("");
  });
  data.forEach((item) => {
    item.status = 0;
  });
  cMessage.value = data;
  return data;
});
//在线用户数组
let usersList = computed(() => {
  if (!menuList.value.length) return users.value;
  let index = users.value.findIndex(
    (item) => item.nickname + "(YOU)" == menuList.value[0].nickname
  );
  users.value.splice(index, 1);
  users.value.unshift(menuList.value[0]);
  return users.value;
});
onMounted(() => {
  //判断本地是否有用户信息
  //有则使用当前信息进行创建连接
  //无则弹窗新建用户并连接服务
  let u = localStorage.getItem("userInfo");
  if (u) {
    userInfo = JSON.parse(u);
    uid.value = userInfo.uid;
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
  //连接服务获取所有用户列表
  WebSocket.value = useWebSocket(messageList, users, {
    type: 3,
  });

  ElMessageBox.prompt("请输入昵称", "提示", {
    confirmButtonText: "确定",
    showCancelButton: false,
    closeOnClickModal: false,
    inputValidator: (value) => {
      let some = users.value.some((item) => item.nickname == value);
      if (!value) return "请输入昵称!";
      if (some) return "昵称已存在!";
    },
  }).then(({ value }) => {
    let user = {
      uid: menuList.value.length + Math.random() * 1000,
      nickname: value,
      usertype: 2,
    };
    uid.value = user.uid;
    localStorage.setItem("userInfo", JSON.stringify(user));
    menuList.value.unshift({
      nickname: value + "(YOU)",
    });
    userInfo = user;
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
//组件销毁前关闭连接
onBeforeUnmount(() => {
  WebSocket.value.close();
});
interface sendMessage {
  type: number;
  date: string;
  users: object[];
  msg: string;
  bridge: number | string[];
}
//发送消息
let submit = () => {
  let sendMsg: sendMessage = {
    ...userInfo,
    type: 2,
    date: moment().format("YYYY-MM-DD HH:mm:ss"),
    users: users.value,
    msg: textarea.value,
    bridge: bridge.value,
  };
  messageList.value.push(sendMsg);
  useSend(WebSocket, sendMsg);
  textarea.value = "";
};
//发送数据删除当前用户
let removeUserInfo = () => {
  useSend(WebSocket, {
    type: 4,
    ...userInfo,
    date: moment().format("YYYY-MM-DD HH:mm:ss"),
  });
  localStorage.removeItem("userInfo");
  location.reload();
};
//重置连接
let reLink = () => {
  const loading = ElLoading.service({
    lock: true,
    text: "连接中...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  WebSocket.value = useWebSocket(
    messageList,
    users,
    {
      ...userInfo,
      type: 1,
      date: moment().format("YYYY-MM-DD HH:mm:ss"),
      users: users.value,
      msg: "",
      bridge: [],
    },
    () => {
      loading.close();
    }
  );
};
</script>

<template>
  <div id="chat-container">
    <aside class="menu">
      <h3>聊天列表</h3>
      <p
        v-for="item in usersList"
        :key="item.nickname"
        @click="clickMenu(item)"
        :class="{ active: bridge[1] == item.uid && chatType == item.usertype }"
      >
        <span class="nickname-item"> {{ item.nickname }}</span>
        <span class="msgtip" v-show="getMsgNum(item)">{{
          getMsgNum(item)
        }}</span>
        <span v-show="!getMsgNum(item)"></span>
      </p>
      <div class="btncon">
        <el-popconfirm
          confirm-button-text="确定"
          cancel-button-text="取消"
          title="确定删除用户数据吗？"
          @confirm="removeUserInfo"
        >
          <template #reference>
            <el-button size="small" class="btn">清除用户信息</el-button>
          </template>
        </el-popconfirm>
        <el-button size="small" class="btn" @click="reLink">重置连接</el-button>
      </div>
    </aside>
    <main class="main-body" v-if="chatType == 0">
      <p class="no-chat">暂无内容</p>
    </main>
    <main class="main-body" v-else>
      <p class="title">{{ title }}</p>
      <div style="border-bottom: 1px solid #ccc" />
      <div class="text-body" ref="msgbox">
        <div
          style="margin: 5px 0"
          :class="{ user: item.uid == uid }"
          v-for="item in currentMessage"
          :key="item.date"
        >
          <span v-if="item.type === 1" style="margin: 5px 0">
            <p class="join-tips">{{ item.msg }}</p>
            <p class="join-tips">{{ item.date }}</p>
          </span>
          <span v-else>
            <p class="message-date">
              <!--   <span class="m-nickname">{{ item.nickname }}</span>-->
              {{ item.date }}
            </p>
            <div class="message-box">
              <span class="avatar" v-if="item.uid != uid"
                ><el-avatar style="margin-right: 5px">
                  {{ item.nickname }}
                </el-avatar>
                <span
                  class="content-msg"
                  :style="{ background: item.uid == uid ? '#79D289' : '#eee' }"
                  >{{ item.msg }}</span
                >
              </span>
              <span
                class="content-msg"
                v-if="item.uid == uid"
                :style="{ background: item.uid == uid ? '#79D289' : '#eee' }"
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
      width: 100%;
      text-align: center;
      border-bottom: 1px solid #ccc;
    }

    .msgtip {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #409eff;
      color: #fff;
      line-height: 20px;
      text-align: center;
    }
    p {
      width: 100%;
      line-height: 25px;
      border-bottom: 1px solid #ccc;
      padding: 2px 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btncon {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      overflow: hidden;
      .btn {
        margin-top: 10px;
      }
    }
  }
  .main-body {
    flex: 1;
    height: 100%;
    border: 1px solid red;
    display: flex;
    flex-direction: column;
    .no-chat {
      text-align: center;
      line-height: 85vh;
      color: #ccc;
    }
    .title {
      text-align: center;
    }
    .text-body {
      flex: 1;
      padding: 0 5px;
      overflow: auto;
      .user {
        text-align: right;
      }
      .join-tips {
        text-align: center;
        color: #ccc;
        font-size: 12px;
        line-height: 12px;
      }
      .m-nickname {
        color: #409eff;
      }
      .message-box {
        font-size: 20px;
        width: 100%;
        .avatar {
          margin-right: 5px;
          display: flex;
          align-items: center;
        }
        .content-msg {
          display: inline-block;
          max-width: 80%;
          border-radius: 5px;
          background: #eee;
          padding: 2px 10px;
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
