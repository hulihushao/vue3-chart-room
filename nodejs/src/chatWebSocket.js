function chatWebSocketServer() {
  const WebSocket = require("ws");
  let users = [
    {
      nickname: "测试群聊",
      usertype: 1,
    },
    {
      nickname: "测试用户",
      usertype: 2,
      uid: 1,
    },
  ];
  let conns = {};
  let chatMessage = [
    {
      type: 1,
      name: "qq",
      msg: "测试用户进入聊天室",
      date: "2020-04-05 12:00:00",
      nickname: "测试用户",
      bridge: [],
    },
    {
      uid: 1,
      type: 2,
      name: "qq",
      msg: "测试测试",
      date: "2023-03-13 04:22:00",
      nickname: "测试用户",
      bridge: [327.0110048992845, 1],
      status: 1,
      statusUid: [],
    },
    {
      uid: "327.0110048992845",
      type: 1,
      name: "qq",
      msg: "测试测试222",
      date: "2023-05-25 13:00:05",
      nickname: "CSYL",
      bridge: [327.0110048992845, 1],
      status: 1,
      statusUid: [],
    },
  ];
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
        conns[item] && conns[item].send(JSON.stringify(message));
      });
      return;
    }
    server.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        chatMessage.forEach(item=>{
          if(!item.bridge||!item.bridge.length){
            if(item.statusValue.indexOf(client.user.uid)>-1){
              item.status=0
            }else{
              item.status=1
            }
          }
        })
        message.chatMessage=chatMessage
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
      ws.user={uid:obj.uid}
      //1:进入聊天室，2:发送消息，3:获取用户列表，4:删除用户
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
              usertype: obj.usertype,
            });
          }
          console.log(isSelf, obj.uid, users, "所有用户");
          let m = {
            type: 1,
            nickname: obj.nickname,
            uid: obj.uid,
            msg: `${obj.nickname}进入了聊天室`,
            date: obj.date,
            users,
            bridge: obj.bridge,
          };
          chatMessage.push(m);
          broadcast({ ...m, chatMessage });
          break;
        case 2:
          let n = {
            type: 2,
            nickname: obj.nickname,
            uid: obj.uid,
            msg: obj.msg,
            date: obj.date,
            users,
            bridge: obj.bridge,
            status: 1, // 表示未读
            statusUid: [],
          };
          //处理群聊的消息未读数
          
          chatMessage.push(n);
          //设置测试用户的消息回复
          let bridgeTo = obj.bridge.filter((item) => item != obj.uid);
          if (!conns[bridgeTo[0]]) {
            chatMessage.push({
              type: 2,
              nickname: users.filter((item) => item.uid == bridgeTo[0])[0]
                .nickname,
              uid: bridgeTo[0],
              msg: obj.msg,
              date: obj.date,
              users,
              bridge: obj.bridge,
              status: 1, // 表示未读
              statusUid: [],
            });
          }
          
          broadcast({ ...n, chatMessage });
          break;
        case 3:
          broadcast({
            users,
            msg: "",
            type: 3,
            bridge: [],
            chatMessage,
          });
          break;
        case 4:
          let userid = obj.uid;
          let index = users.findIndex((item) => item.uid == userid);
          let del = users.splice(index, 1);
          let x = {
            type: 1,
            nickname: del.nickname,
            uid: del.uid,
            msg: `${del.nickname}离开了聊天室`,
            date: obj.date,
            users,
            bridge: [],
          };
          chatMessage.push(x);
          broadcast({ ...x, chatMessage });
          break;
        case 5:
          let messages = obj.messages;
          chatMessage.forEach((item) => {
            let f = messages.filter(
              (itm) =>
                itm.msg == item.msg &&
                itm.date == item.date &&
                itm.uid == item.uid
            );
            if (f.length) {
              item.status = 0;
              item.statusUid.push(obj.uid);
            }
          });
          break;
      }
    });
  });
}
module.exports = chatWebSocketServer;
