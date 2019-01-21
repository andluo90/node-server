const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')

const port = process.argv[2] || 9000

http.createServer((req,res)=>{
    console.log(`${req.method} ${req.url}`)
    res.write("Hello Node!")
    res.end();

}).listen(parseInt(port))

console.log(`server listing on port ${port}`)