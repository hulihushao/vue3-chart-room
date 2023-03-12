import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
export function useWebSocket(messageList,users, message) {
  let socket = ref(null);
  socket.value = new WebSocket("ws://192.168.241.2:8081");
  socket.value.addEventListener("open", function () {
    ElMessage.success("连接服务器成功");
    useSend(socket, message);
  });
  socket.value.addEventListener("message", function (e) {
    let data = JSON.parse(e.data);
    users.value = data.users;
    messageList.value.push(data);
  });
  //useOnMessage(socket,refValue)
  socket.value.onerror = (error) => {
    ElMessage.error("服务连接失败！请联系管理员");
  };
  socket.value.onclose = () => {
    ElMessage.error("连接已关闭");
    socket.close();
  };
  return socket.value
}

export function useSend(socket, message) {
  socket.value.send(
    JSON.stringify(message)
  );
}
