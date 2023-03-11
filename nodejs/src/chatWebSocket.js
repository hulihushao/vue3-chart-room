function chatWebSocketServer() {
  const WebSocket = require("ws");

  const server = new WebSocket.Server({ port: 8081 });
  console.log("chatWebSocket创建成功");
  server.on("open", function open() {
    console.log("connected");
  });

  server.on("close", function close() {
    console.log("disconnected");
  });

  let broadcast = (message) => {
    server.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
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
          broadcast({
            type: 1,
            nickname: obj.nickname,
            uid: obj.uid,
            msg: `${obj.nickname}进入了聊天室`,
            date: obj.date,
          });
          break;
        case 2:
          broadcast({
            type: 2,
            nickname: obj.nickname,
            uid: obj.uid,
            msg: obj.msg,
            date: obj.date,
          });
          break;
      }
    });
  });
}
module.exports = chatWebSocketServer;
