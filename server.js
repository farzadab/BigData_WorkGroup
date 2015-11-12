#!/usr/bin/env node

var http = require("http"),
    url = require("url"),
    ejs = require("ejs"),
    fs = require("fs"),
    staticResource = require("static-resource"),
    port = 8080,
    serverUrl,
    handler;

serverUrl = "http://localhost:" + port + "/";
handler = staticResource.createHandler(fs.realpathSync("./public"));

http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;

    if (path === "/") {
        res.writeHead(200, {"Content-Type": "text/html"});
        // res.write(ejs.render(fs.readFileSync("./index.ejs", "utf8")));
        var server = require('./library/elasticServer.js');

        var p = server.query('MATCH (n) RETURN n');
        res.end();
    }
    else if (path==="/news_graph"){
        // x.split("&")
        // y.forEach(function(entry){
        // console.log(url.parse(req.url));
        graph = require("./data/keywordGraph.json");
        // res.write("Gra ")
        // console.log(res);
        res.write(JSON.stringify(graph));
        res.end();
    }
    else {
        if (!handler.handle(path, req, res)) {
            res.writeHead(404);
            res.write("404");
            res.end();
        }
    }
}).listen(port);

console.log("The HTTP server has started at: " + serverUrl);
