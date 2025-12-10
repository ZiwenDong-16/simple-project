// backend/server.js
const WebSocket = require('ws');

// 在 4000 端口启动一个 WebSocket 服务器
const wss = new WebSocket.Server({ port: 4000 }, () => {
  console.log('✅ WebSocket server started on ws://localhost:4000');
});

// 用一个集合保存所有连接的客户端
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('🔌 New client connected');
  clients.add(ws);

  ws.on('message', (message) => {
    const text = message.toString();
    console.log('📨 received:', text);

    // 目前先做“简单广播”：收到什么，就转发给所有其他客户端
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(text);
      }
    }
  });

  ws.on('close', () => {
    console.log('❌ client disconnected');
    clients.delete(ws);
  });
});
