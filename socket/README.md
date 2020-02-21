## 一个用express 和 ws包写的留言板的例子。

## 要点
- socket建立连接时是使用http协议的，但是，它建立连接之后，就使用ws协议了。 express中的中间件将不能被匹配。

- 写一个登陆接口，用来登记昵称。 这个登陆是一个ajax请求，用户登陆成功，设置cookie，则随后的socket连接时，也会有把这个cookie带过去。
- 使用segmentui写的页面。

## 使用步骤

- 下载代码，并进入此目录
- 运行 `node i` 以安装依赖
- 把static下index.html中的baseURL改成本机ip地址。
- `node app_http.js`  启动服务器
- 访问页面:开启浏览器，在地址栏中输入： localhost:3000访问。 可以使用不同的浏览器进行访问，以模拟多个客户端访问。


