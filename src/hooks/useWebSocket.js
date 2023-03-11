import {ref} from "vue"
import { ElMessage} from 'element-plus'
export function useWebSocket(refValue,user) {
    let socket=ref(null)
  socket.value = new WebSocket("ws://192.168.241.2:8081");
  socket.value.addEventListener("open", function () {
    alert( "连接服务器成功")
    useSend(socket,user)
  });
  socket.value.addEventListener("message", function (e) {
    refValue.value.push(e.data)
  });
  socket.value.onerror = (error) => {
    
  };
  socket.value.onclose = () => {
    ElMessage.error("连接已关闭")
  };
  
}
export function useOnMessage(socket,values){
    
}
export function useSend(socket,message){
  socket.value.send(JSON.stringify(message))
}