#!/Program Files/nodejs/node

console.log('Content-Type: application/json \n');
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

// create a new socket object.
var client = new net.Socket();
// keep socket open(alive).
client.setKeepAlive(true,30);

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

//////////////////////////////////////////////////////////////////////
// Socket events
// add a data event to client side.
// 'data' is what scheduler respond back.
client.on('data', function (data) {

	// parse data send from scheduler
	var parseddata = JSON.parse(data);
	// console out, send to browser
	console.log(JSON.stringify(parseddata));

	// close socket
	client.end();
});

// socket error event
client.on('error', function() {
	// JSON encode
	var json = util.encodeJSON("UI", "ERROR", null, null, null, "Socket connection ERROR");
	console.log(JSON.stringify(json));//{"Message":"Socket connection ERROR"}));
});

// client.on('end', function () {
// 	// var parsedData = JSON.parse(inputChunk);
// 	// console.log(inputData);
// 	// client.close();
// });

// // add a close event to close connection.
// client.on('close', function() {
// 	// console.log(inputData);
// 	// client.destroy(); // kill client after server's response
// 	// console.log(JSON.stringify({"message":"Socket will disconnect."}));
// });

//////////////////////////////////////////////////////////////////////////
// AJAX event
// stdin listener, listen to data coming from UI browser.
stdin.on('data', function (data) {
	inputData = data;//.toString().trim();
	// inputData = JSON.parse(data);
});

stdin.on('end', function () {
	// Parse JSON data
	var parsedData = JSON.parse(inputData);
	// connect socket
	client.connect(PORT, HOST);
	// stdout, send it back to UI browser.
	// console.log(JSON.stringify({"testdata": queryJSON.command}));

	if (parsedData.CmdDest === "SCHD") {
		// console.log(JSON.stringify({"message": "Direction to SCHD"}));
		// send to scheduler through socket
		client.write(inputData);
	}
	else if (parsedData.CmdDest === "DB") {
		console.log(JSON.stringify({"message": "Direction to DB"}));
	}
	else
		console.log(JSON.stringify({"message": "Other, might be error"}));
});