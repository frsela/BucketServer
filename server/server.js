/* jshint node: true */
/**
 * Simple socket.ios server
 * (c) Telefonica Digital, 2013 - All rights reserved
 * License: GNU Affero V3 (see LICENSE file)
 * Fernando Rodríguez Sela <frsela@tid.es>
 */

var SocketIOServer = require('socket.io'),
    http = require('http');

function bucketServer() {}
bucketServer.prototype = {
  init: function(ip, port) {
    this.ip = ip;
    this.port = port;
  },

  start: function() {
    bucketServer.sIOEmit = function() {
      console.log('No viewer registered !');
    };

    // HTTP init
    this.server = http.createServer(this.onHTTPMessage.bind(this));
    this.server.listen(this.port, this.ip);
    console.log('Viewer server listening at ' + this.port);

    // Socket.IO init
    this.sioServer = SocketIOServer.listen(this.server);
    this.sioServer.on('connection', this.onSIOConnection);
  },

  close: function() {
    console.log('Bye');
    process.exit();
  },

  //////////////////////
  // HTTP Callback
  //////////////////////
  onHTTPMessage: function(request, response) {
    console.log('HTTP message received - ' + request.url);

    var buffer = '';
    request.on('data', function(chunk) {
      console.log("Chunk " + chunk);
      buffer += chunk;
    });

    request.on('end', function() {
      console.log('End');
      response.setHeader('Content-Type', 'text/html');
      response.statusCode = 200;
      response.end();

      bucketServer.sIOEmit('dataReceived', {
        timestamp: Date.now(),
        time: new Date(),
        origin: request.socket.remoteAddress + ':' + request.socket.remotePort,
        path: request.url,
        method: request.method,
        headers: request.headers,
        payload: buffer
      });
    });
  },

  //////////////////////
  // Socket.IO Callbacks
  //////////////////////
  onSIOConnection: function(socket) {
    if (bucketServer.socketIO) {
      console.log('Other client connected. Cancelling...');
      socket.emit('otherConnected');
      bucketServer.sIOEmit('otherTryingToConnect');
      return;
    }
    bucketServer.socketIO = socket;
    bucketServer.sIOEmit = function(event, data) {
      if (bucketServer.socketIO) {
        bucketServer.socketIO.emit(event, data);
      } else {
        console.log('No viewer registered !');
      }
    };

    var self = this;
    var keepAliveInterval = setInterval(function() {
      bucketServer.sIOEmit('keepAlive', {
        pid: process.pid,
        time: new Date()
      });
    }, 1000);
    socket.on('disconnect', function() {
      console.log('Client disconnected');
      bucketServer.socketIO = null;
      bucketServer.sIOEmit = function() {
        console.log('No viewer registered !');
      };
      clearInterval(keepAliveInterval);
    });

    console.log('Client connected !');
  }
}

/* Start */
var bucketSrv = new bucketServer();
bucketSrv.init('0.0.0.0', 8888);
process.on('SIGTERM', bucketSrv.close);
process.on('SIGINT', bucketSrv.close);
bucketSrv.start();
