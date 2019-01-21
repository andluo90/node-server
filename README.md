# node-server
用node.js实现静态服务器

## 使用方式
1. 下载`static-server.js`到本地
2. 进入`static-server.js`所在目录
3. 执行`node static-server.js` 即会把当前目录当前静态服务器的根目录，端口号默认为 `9000`
    - 或者执行 `node static-server.js 8080 ～/test` 则会把当前用户下的`test`目录当前服务器的根目录，端口号为`8080`
4. 访问`127.0.0.1`即会访问 `127.0.0.1/index.html`

