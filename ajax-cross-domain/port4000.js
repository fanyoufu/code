const express = require("express");
const path = require("path");


const app = express();
app.use(express.static(path.join(__dirname, "/public")));

app.all('/getData', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
}); 

console.info(__dirname);
app.get("/",(req,res)=>{
	res.sendFile(__dirname +"/4000.html");
});

app.get("/getDataJsonp",(req,res)=>{
	let d = require("./data.json");
	res.jsonp(d); // 
});

app.get("/getData",(req,res)=>{
	let d = require("./data.json");
	res.end(d);
	//res.end("alert('fyf')");
	res.end("f("+JSON.stringify(d)+")"); // 直接输出json
});

app.listen(4000,()=>{
	console.log("http server is listening in port 4000...")
})
