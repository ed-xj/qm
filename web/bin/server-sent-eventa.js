#!/Program Files/nodejs/node

// implementing long polling
// server-sent events (looping server)


console.log('Content-Type: text/event-stream\n');
console.log('Cache-Control: no-cache\n')
console.log('Connection: keep-alive\n')
///////////////////////////////////////////////////////////////////////
// Log System //
var log = require('./logsystem-apache.js');
var moment = require('./moment.js');
///////////////////////////////////////////////////////////////////////
// Socket //
/* Or use this example tcp client written in node.js.  (Originated with 
example code from 
http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html.) */

// 'net' module
// https://nodejs.org/api/net.html#net_net
var net = require('net');

// give server ip address and port.
var HOST = '127.0.0.1';
var PORT = 1337;

// check if socket is already connected. If not, create a new socket object.
var client = new net.Socket();
// keep socket open(alive). Find a best time.
client.setKeepAlive(true,600000);

///////////////////////////////////////////////////////////////////////
// AJAX //
// var sys = require("sys");
var stdin = process.openStdin();
// var stdin = process.stdin();
// stdin.resume();
stdin.setEncoding('utf8');
var inputData = '';

/////////////////////////////////////////////
// JSON encode and decode
var util = require('../../ui/web/lib/utility.js');

function sendSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  var id = (new Date()).toLocaleTimeString();

  // Sends a SSE every 5 seconds on a single connection.
  setInterval(function() {
    constructSSE(res, id, (new Date()).toLocaleTimeString());
  }, 5000);

  constructSSE(res, id, (new Date()).toLocaleTimeString());
}

function constructSSE(res, id, data) {
  res.write('id: ' + id + '\n');
  res.write("data: " + data + '\n\n');
}

function debugHeaders(req) {
  sys.puts('URL: ' + req.url);
  for (var key in req.headers) {
    sys.puts(key + ': ' + req.headers[key]);
  }
  sys.puts('\n\n');
}