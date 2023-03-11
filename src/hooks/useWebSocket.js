import {ref} from "vue"
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

  };
  return socket
}
export function useOnMessage(socket,values){
    socket.addEventListener("message", function (e) {
    values.value.push(e.data)
  });
}
export function useSend(socket,message){
  socket.value.send(JSON.stringify(message))
}