const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')

const port = process.argv[2] || 9000 //默认9000端口

__dirname = process.argv[3] || __dirname //默认路径为当前文件夹

http.createServer((req,res)=>{
    const {method} = req
    
    req.on('error',(err)=>{
        console.log(`on error: ${err}`)
    })
    
    console.log(`${method}请求: ${req.url}`)

    //判断Get or Post
    if(method === 'GET'){

        req.url = req.url === '/' ? '/index.html':req.url

        let pathObj = url.parse(req.url,true)
        
        let query = pathObj.query
        if(Object.keys(query).length === 0){
            //处理不带参数的get请求
            let file_path = path.join(__dirname,pathObj.pathname)
            fs.readFile(file_path,(err,data)=>{
                if(err){
                    console.log(`${req.method} ${req.url} is not find.`)
                    res.writeHead(404,'Not Find.')
                    return res.end("<h1 style='color:red'>404...</h1>")
                }
                
                res.writeHead(200,'ok')
                res.write(data)
                return res.end()

            })
        }else{
            //处理带参数的get请求
            if(pathObj.pathname === '/test'){
                res.end(JSON.stringify(query))
            }else{
                return res.end("<h1 style='color:red'>404...</h1>")
            }
        }

    }else if(method === 'POST'){
        //处理POST请求
        let body = []
        req.on('data',(chunk)=>{
            body.push(chunk)
        }).on('end',()=>{
            body = Buffer.concat(body).toString() 
            console.log(`body is ${body}.`)
        })
        res.end(`post请求：${body}`)
    }else{
        res.end(`${method} 方式请求超出范围.`)
    }
}).listen(parseInt(port))



console.log(`server listing on port ${port}`)
console.log(`默认访问路径为 ${__dirname}`)
