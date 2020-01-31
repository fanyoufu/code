// var app = require('express')();
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

// io.on('connection', function(socket){

//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });

//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
// });

// http.listen(3000,  function(){
//   console.log('listening on *:3000');
// });


// 导入WebSocket模块:
const WebSocket = require('ws');

// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wss = new WebSocketServer({
    port: 3001
});
wss.broadcast = function (data) {
    wss.clients.forEach(function (client) {
        client.send(data);
    });
};
wss.on('connection', function (ws) {
    console.log(ws.upgradeReq);
    
    console.log(`[SERVER] connection()`);
    ws.on('message', function (message) {
        console.log(`[SERVER] Received: ${message}`);
        ws.send(`ECHO: ${message}`, (err) => {
            if (err) {
                console.log(`[SERVER] error: ${err}`);
            }
        });
    })

    ws.on('close',function(xs,reason) {
        console.dir(this);
        console.log('客户端断开');
        
        console.log(xs,reason);
        
    })


    setInterval(() => {
        wss.broadcast("服务器的广播"+Math.random())
    }, 3000);
});