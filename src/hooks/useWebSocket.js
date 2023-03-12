import {ref} from "vue"
import { ElMessage} from 'element-plus'
export function useWebSocket(refValue,user) {
    let socket=ref(null)
  socket.value = new WebSocket("ws://192.168.241.2:8081");
  socket.value.addEventListener("open", function () {
    alert( "连接服务器成功")
    useSend(socket,user)
  });
  useOnMessage(socket,refValue)
  socket.value.onerror = (error) => {
    
  };
  socket.value.onclose = () => {
    ElMessage.error("连接已关闭")
  };
  return socket
}
export function useOnMessage(socket,refValue){
    socket.value.addEventListener("message", function (e) {
    refValue.value.push(e.data)
  });
}
export function useSend(socket,message){
  socket.value.send(JSON.stringify(message))
}