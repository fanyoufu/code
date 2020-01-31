var express = require('express');
var bodyparser = require('body-parser')
const qs = require('querystring')
const WebSocket = require('ws');


var app =  express();

var server = require('http').createServer(app);
// 导入WebSocket模块

// 托管静态资源：让static目录下的内容可以直接访问
app.use(express.static('static'))

// 解析post传参，以保存在req.body中
app.use(bodyparser.urlencoded({extended:false}))


// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wss = new WebSocketServer({
    server
});
// wss是一个对象，我们可以直接给它挂载方法

// 广播：让所有的客户端都能收到信息
wss.broadcast = function (nickname,msg) {
    wss.clients.forEach(function (client) {
        // console.log(client.nickname)
        let data = JSON.stringify( {nickname, msg})
        client.send(data);
    });
};

wss.sayto = function (nickname,data) {
    wss.clients.forEach(function (client) {
        if(client.nickname === nickname) {
            client.send(data);
        }
    });
};

// 检查某个用户名是否已经有用过了
wss.isUsed = function(nickname) {
    if(!wss.clients){
        return false
    }
    return [...wss.clients].some(ws=>ws.nickname == nickname)
}


// 用户登陆
app.post('/login',(req,res)=>{
    if(req.body.name) {
        console.log(`${req.body.name}尝试登陆....`)
        if( wss.isUsed (req.body.name)) {
            res.json( {code:300,msg:'名字已占用'})
        } else {

            res.cookie('nickname', req.body.name)
            res.json({
                code: 200,
                nickname:req.body.name,
                msg:"登陆成功"
            })
        }
    } else {
        res.json({
            code:401,
            msg:'必须要输入名字'
        })
    }
})



wss.on('connection', function (ws,req) {
    // console.log(`[SERVER] connection: ${req.connection.remoteAddress}, ${req.url}`);
    // console.log(`${req.headers.cookie}`);
    // console.log(`${cookiestr}`);
    
    if( !req.headers.cookie) { 
        // 强制下线
        ws.send(JSON.stringify( {nickname:'管理员', msg:`没有登陆哈`}))
        ws.close()
        return 
    }
    // 从cookie中解析出nickname
    let cookiestr = req.headers.cookie.replace(/\;\s+/g, '&');
    let { nickname } = qs.parse(cookiestr);

    if(!nickname){
        ws.send(JSON.stringify( {nickname:'管理员', msg:`没有登陆哈`}))
        ws.close()
        return;
    }
    // 保存用户名
    ws.nickname = nickname

    // 广播上线信息
    wss.broadcast('管理员',`${nickname}上线了，大家欢迎！`)

    // 监听客户端发来的信息
    ws.on('message', function (message) {
        console.log(`[SERVER] Received: ${message}`);
        var obj = JSON.parse(message)
        if(obj.person === "all") {
            wss.broadcast(this.nickname, obj.msg)
        } else {
            wss.sayto(obj.person,JSON.stringify( {nickname:this.nickname, msg:obj.msg}) )
        }
    })

    ws.on('close',function(code,reason) {
        console.log( `${this.nickname}下线了`)
        wss.broadcast('管理员',`${this.nickname}下线了` )
    })

});

server.listen(3000,  function(){
    console.log('listening on *:3000');
});