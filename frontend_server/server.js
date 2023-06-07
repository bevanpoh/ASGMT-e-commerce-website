//Admission No.: P2112745  
//Class: DAAA/1B02
//Name: Bevan Poh

const express = require('express');
const serveStatic = require('serve-static');

var hostname = "localhost";
var port = 3001;

var app = express();


app.use(function (req, res, next) {
    if (req.method != "GET") {
        res.type('.html');
        var msg = "<html><body>This server only serves web pages with GET!</body></html>";
        res.end(msg);
    } else {
        next();
    }
});

app.use(serveStatic(__dirname + "/public"));


app.listen(port, hostname, function () {

    console.log(`FrontEnd at http://${hostname}:${port}`);
});