## 一个用express 和 ws包写的留言板的例子。

## 要点
- socket建立连接时是使用http协议的，但是，它建立连接之后，就使用ws协议了。 express中的中间件将不能被匹配。



