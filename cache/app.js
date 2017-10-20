/*
 * @Author: FangFeiyue 
 * @Date: 2017-10-20 09:10:09 
 * @Last Modified by: FangFeiyue
 * @Last Modified time: 2017-10-20 09:53:50
 */
/* 
读写文件

1. 文件存在
    1.读写成功
    2.读写失败
2. 文件不存在
*/
var PORT   = 8000,
    fs     = require('fs'),
    url    = require('url'),
    http   = require('http'),
    path   = require('path'),
    mime   = require('mime').types;
    config = require('config');
 
var server = http.createServer(function(request, response){
    var contentType = "image/png",
        pathName = url.parse(request.url).pathname,
        realPath = 'assets' + pathName,
        ext      = path.extname(realPath);
    
    ext          = ext ? ext.slice(1) : 'unknown';    
    contentType  = mime[ext] || "text/plain";

    if (ext.match(config.Expires.fileMatch)){
        var expires = new Date();
        expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
        response.setHeader('Expires', expires.toUTCString());
        response.setHeader('Cache-Control', 'max-age=' + config.Expires.maxAge);
    }

    fs.exists(realPath, function(exists){
        if (!exists){
            response.writeHead(404, {
                'Content-type': contentType
            });
            
            response.write('This request URL ' + pathName + ' was not found');
            response.end();
        }else{
            fs.readFile(realPath, 'binary', function(err, file){
                if (err){
                    response.writeHead(500, {
                        'Content-type': contentType
                    });
                    response.write('read file is error');
                    response.end();
                }else{
                    response.writeHead(200, {
                        'Content-type': contentType
                    });

                    response.write(file, 'binary');
                    response.end();
                }
            });
        }
    });
});

server.listen(PORT);
console.log('Server runing at port' + PORT);