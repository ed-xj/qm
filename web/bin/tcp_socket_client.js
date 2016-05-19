#!/Program Files/nodejs/node

console.log('Content-Type: application/json \n');
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

//////////////////////////////////////////////////////////////////////
// Socket events
// add a data event to client side.
// 'data' is what scheduler respond back.

// var testdata = []	// testing push and pop

client.on('data', function (data) {
	// parse data send from scheduler
	var parseddata = JSON.parse(data);
	// console out, send to browser
	console.log(JSON.stringify(parseddata));
	// close socket
	client.end();

	// push and pop
	// testdata.push(JSON.stringify(JSON.parse(data)))
	// if (testdata.length !== 0) {

	// }

	// server log
	var message = "Receive data from Socket(scheduler). Close Socket." + JSON.stringify(parseddata);
	var now = moment();
	log.fileExist(now);
	log.appendToFile(now, message);
	log.checkFileCreatedTime(now);
});

// socket "end" event
// client.on('end', function() {
// 	var get = testdata.shift()
// });

// socket error event
client.on('error', function() {
	// JSON encode
	var json = util.encodeJSON("UI", "ERROR", null, null, null, "Socket connection ERROR");
	console.log(JSON.stringify(json));//{"Message":"Socket connection ERROR"}));
	// server log 
	var message = "Socket connection Error. " + JSON.stringify(json);
	var now = moment();
	log.fileExist(now);
	log.appendToFile(now, message);
	log.checkFileCreatedTime(now);
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

	// Parse JSON data
	var parsedData = JSON.parse(inputData);

	// stdout, send it back to UI browser.
	if (parsedData.CmdDest === "SCHD") {
		// connect socket
		client.connect(PORT, HOST);
		// console.log(JSON.stringify({"message": "Direction to SCHD"}));
		// send to scheduler through socket
		client.write(inputData);
		// server log
		var message = "Connect Socket. Send data through Socket to scheduler. " + JSON.stringify(parsedData);
		var now = moment();
		log.fileExist(now);
		log.appendToFile(now, message);
		log.checkFileCreatedTime(now);
	}
	else if (parsedData.CmdDest === "APACHE") {
		// console.log(JSON.stringify({"message": "Direction to DB"}));
		var now = moment();
		log.fileExist(now);
		log.appendToFile(now, parsedData.Message);
		log.renameAndSave(now);
	}
	else
		console.log(JSON.stringify({"message": "Other, might be error"}));


	// server log
	var message = "AJAX event receive from UI. " + JSON.stringify(JSON.parse(inputData));
	var now = moment();
	log.fileExist(now);
	log.appendToFile(now, message);
	log.checkFileCreatedTime(now);
});

// stdin.on('end', function () {
// 	// Parse JSON data
// 	var parsedData = JSON.parse(inputData);

// 	// stdout, send it back to UI browser.
// 	if (parsedData.CmdDest === "SCHD") {
// 		// connect socket
// 		client.connect(PORT, HOST);
// 		// console.log(JSON.stringify({"message": "Direction to SCHD"}));
// 		// send to scheduler through socket
// 		client.write(inputData);
// 		// server log
// 		var message = "Connect Socket. Send data through Socket to scheduler. " + JSON.stringify(parsedData);
// 		var now = moment();
// 		log.fileExist(now);
// 		log.appendToFile(now, message);
// 		log.checkFileCreatedTime(now);
// 	}
// 	else if (parsedData.CmdDest === "APACHE") {
// 		// console.log(JSON.stringify({"message": "Direction to DB"}));
// 		var now = moment();
// 		log.fileExist(now);
// 		log.appendToFile(now, parsedData.Message);
// 		log.renameAndSave(now);
// 	}
// 	else
// 		console.log(JSON.stringify({"message": "Other, might be error"}));
// });