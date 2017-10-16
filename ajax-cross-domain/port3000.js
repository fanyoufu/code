const express = require("express");
const https = require("https");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "/public")));

app.get("/",(req,res)=>{
	res.sendFile(__dirname +"/3000.html"); //直接引入3000.html文件
});


app.get("/getData",(req,res)=>{
	let d = require("./data.json");
	res.json(d); // 直接输出json
});



app.get("/getZhihu",(req,res1)=>{
	let url = "https://news-at.zhihu.com/api/4/news/latest";

	https.get(url,(res)=>{
		let str = "";
		res.on("data",(chunk)=>{
			str += chunk;
		})

		res.on('end',()=>{
			res1.json(str);
		})
	})
});

app.listen(3000,()=>{
	console.log("http server is listening in port 3000...")
})
