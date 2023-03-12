function chatWebSocketServer() {
  const WebSocket = require("ws");
  let users = [{
    nickname: "群一",
    usertype: 1,
  },
  {
    nickname: "用户一",
    usertype: 2,
    uid: 2,
  }];
  let conns = {};
  let chatMessage=[]
  const server = new WebSocket.Server({ port: 8081 });
  console.log("chatWebSocket创建成功");
  server.on("open", function open() {
    console.log("connected");
  });

  server.on("close", function close() {
    console.log("disconnected");
    server.close();
  });

  let broadcast = (message) => {
    // 单聊
    if (message.bridge && message.bridge.length) {
      message.bridge.forEach((item) => {
        conns[item].send(JSON.stringify(message));
      });
      return;
    }
    server.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  };
  server.on("connection", function connection(ws, req) {
    const ip = req.socket.remoteAddress;
    const port = req.socket.remotePort;
    const clientName = ip + ":" + port;

    console.log("%s is connected ", clientName);

    ws.on("message", function incoming(message) {
      console.log("received: %s from %s", message, clientName);
      const obj = JSON.parse(message);

      switch (obj.type) {
        case 1:
          // 将所有uid对应的连接都保存到一个对象里

          conns[obj.uid] = ws;
          // 不存在uid对应的用户（不是本人），才会添加，避免重复
          const isSelf = users.some((m) => m.uid === obj.uid);
          
          if (!isSelf) {
            users.push({
              nickname: obj.nickname,
              uid: obj.uid,
              usertype:obj.usertype
            });
          }
          console.log(isSelf, obj.uid, users, "所有用户");
          let m={
            type: 1,
            nickname: obj.nickname,
            uid: obj.uid,
            msg: `${obj.nickname}进入了聊天室`,
            date: obj.date,
            users,
            bridge: obj.bridge,
          }
          broadcast({...m,chatMessage});
          chatMessage.push(m)
          break;
        case 2:
        let n={
            type: 2,
            nickname: obj.nickname,
            uid: obj.uid,
            msg: obj.msg,
            date: obj.date,
            users,
            bridge: obj.bridge,
          }
          broadcast({...n,chatMessage});
          chatMessage.push(n)
          break;
      }
    });
  });
}
module.exports = chatWebSocketServer;
