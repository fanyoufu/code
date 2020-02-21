const http = require("http")

let url = "http://localhost:8080/index_csr.html"
// let url = "http://localhost:8080/index_ssr.html"
http.get(url, (res) => {
  let result = ""
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
	  result += chunk
  });
  res.on('end', () => {
    console.log(`爬虫得到的数据是: ${result}`);
  });
});