var express = require('express');
const qs = require('querystring')
var app =  express();
var bodyparser = require('body-parser')

var server = require('http').createServer(app);

app.use(express.static('static'))
app.use(bodyparser.urlencoded({extended:false}))

// 导入WebSocket模块:
const WebSocket = require('ws');

// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wss = new WebSocketServer({
    server
});
wss.broadcast = function (data) {
    wss.clients.forEach(function (client) {
        console.log(client.nickname)
        client.send(data);
    });
};
wss.isUsed = function(nickname) {
    if(!wss.clients){
        return false
    }

    return [...wss.clients].some(ws=>ws.nickname == nickname)
}

wss.sayto = function (ws,data) {
    wss.clients.forEach(function (client) {
        if(client === ws) {
            client.send(data);
        }
    });
};

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
// express.get('/test',(req,res,next)=>{
//     console.log(req.headers);
//     next();
//     // res.send('ok')
// })


wss.on('connection', function (ws,req) {
    console.log(`[SERVER] connection: ${req.connection.remoteAddress}, ${req.url}`);
    
    let cookiestr = req.headers.cookie.replace(/\;\s+/g, '&');
    console.log(`${req.headers.cookie}`);
    console.log(`${cookiestr}`);

    let cookieObj = qs.parse(cookiestr);
    let { nickname } = cookieObj;
    ws.nickname = nickname
    wss.broadcast(JSON.stringify( {nickname:'管理员', msg:`${nickname}上线了，大家欢迎！`}) )

    ws.on('message', function (message) {
        console.log(`[SERVER] Received: ${message}`);
        var obj = JSON.parse(message)
        if(obj.person === "all") {
            wss.broadcast(JSON.stringify( {nickname:this.nickname, msg:obj.msg}) )
        } else {

        }
        // ws.send(`ECHO: ${message}`, (err) => {
        //     if (err) {
        //         console.log(`[SERVER] error: ${err}`);
        //     }
        // });
    })

    ws.on('close',function(code,reason) {
        console.log( `${this.nickname}下线了`)
        wss.broadcast(JSON.stringify( {nickname:'管理员', msg:`${this.nickname}下线了`}) )
    })

});


server.listen(3000,  function(){
    console.log('listening on *:3000');
});