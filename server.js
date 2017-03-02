const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path');

const app = require('./static/js/main')  // our client code


console.log("getting issue feed")
https.get(
  {
    host: '5calls.org',
    path: '/issues/'
  }, 
  function(res) {
    var body = '';

    res.on('data', function(d) {
      console.log("...")
      body += d;
    });
    
    res.on('end', function() {
      console.log("got the feed")
      var issues = JSON.parse(body);
      startServer(issues);
    });

    res.on('error', function() {
      console.log("failed to retrieve the 'issues' feed from 5calls.org");
    });
        
  }
);

function startServer(state) {

  console.log("starting server")

  http.createServer(function (req, res) {
  

    var filePath = '.' + req.url;

    var extname = path.extname(filePath);
    var contentType = 'text/html';

    switch (extname) {
      case '.js':
        contentType = 'text/javascript';
        serveStatic();
        break;
      case '.css':
        contentType = 'text/css';
        serveStatic();
        break;
      case '.json':
        contentType = 'application/json';
        serveStatic();
        break;
      case '.png':
        contentType = 'image/png';
        serveStatic();
        break;      
      case '.jpg':
        contentType = 'image/jpg';
        serveStatic();
        break;
      default: 
    
      //this is the part that delivers the choo rendered html
        console.log("URL:", req.url)
          
        const html = app.toString(req.url, state)
            
        let basePage = fs.readFileSync('./static/html/index.html', 'UTF-8')

        basePage = basePage.replace(/(<!-- snip -->)[^]*(<!-- \/snip -->)/, "$1" + html + "$2")

        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(basePage)    
    }

    function serveStatic()  {
      fs.readFile("./app/static/" + filePath, function(error, content) {
        if (error) {
          if(error.code == 'ENOENT'){
            res.writeHead(404);
            res.end('File not found.: '+error.code+' ..\n');
            res.end();         
          }
          else {
            res.writeHead(500);
            res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            res.end(); 
          }
        }
        else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        }
      });
    } 


  }).listen(8080)
    console.log("listening on 8080");
}