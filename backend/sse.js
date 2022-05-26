'use strict';
const connect = require("connect");
const app = connect();
const ads = require('./data/ads.json')
var fs = require('fs')

const httpServer = require('http').createServer(app);

const SseChannel = require('sse-channel');
const adsChannel = new SseChannel();

app.use(function(req, res, next) {
 res.setHeader("Access-Control-Allow-Origin", "*");
 res.setHeader("Connection", "keep-alive");
 res.setHeader("Cache-Control", "no-cache");
 res.setHeader("Content-Type", "text/event-stream");
 next();
});

app.use(function(req, res) {
 if (req.url.indexOf('/') === 0) {
  adsChannel.addClient(req, res);
  adsChannel.send(ads[Math.floor(Math.random()*ads.length)]);
 } else {
  res.writeHead(404);
  res.end();
 }
});

fs.watchFile('./data/ads.json', (curr, prev) => {
  console.log(`ads file Changed`);
});

setInterval(function broadcastDate() {
 adsChannel.send(ads[Math.floor(Math.random()*ads.length)]);
}, 10000);


httpServer.listen(7654, function() {
 console.log('HTTP SSE server running on port 7654');
});