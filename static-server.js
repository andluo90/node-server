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

            let file_modify_time = null
            let last_modify_time = null
            fs.stat(file_path,(error,file)=>{
                if(error){
                    console.log(`${req.method} ${req.url} is not find.`)
                    res.writeHead(404,'Not Find.')
                    return res.end("<h1 style='color:red'>404...</h1>")
                }
                file_modify_time = file.mtime.toString()
                last_modify_time = req.headers['if-modified-since']
                if(last_modify_time){
                    let d1 = new Date(file_modify_time)
                    let d2 = new Date(last_modify_time)
                    console.log(`d1 time: ${d1.getTime()} , d2 time : ${d2.getTime()}`)
                    if(d1.getTime()>d2.getTime()){
                        console.log(`${file_path} has been modified.`)
                        
                        fs.readFile(file_path,(error,file)=>{
                            res.setHeader('Last-Modified',file_modify_time)
                            res.writeHead(200,'ok')
                            res.write(file)
                            return res.end()
                        })

                              
                    }else{
                        console.log(`304: ${file_path} : not modify`)
                        res.writeHead(304,'not modified')
                        return res.end()
                        
                    }

                }else{
                    fs.readFile(file_path,(error,file)=>{
                        res.setHeader('Last-Modified',file_modify_time)
                        res.writeHead(200,'ok')
                        res.write(file)
                        return res.end()
                    })
                    
                }
            })
            
            if(!req.headers['if-modified-since']){
                console.log(`Last-Modified is null or undefined.`)
                fs.readFile(file_path,(err,file)=>{
                    if(err){
                        console.log(`${req.method} ${req.url} is not find.`)
                        res.writeHead(404,'Not Find.')
                        return res.end("<h1 style='color:red'>404...</h1>")
                    }

                })
            }

            
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
}).listen(parseInt(port),'0.0.0.0')



console.log(`server listing on port ${port}`)
console.log(`默认访问路径为 ${__dirname}`)
