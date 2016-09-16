#!/Program Files/nodejs/node

console.log('Content-Type: plain/text \n');

const fs = require('fs')

///////////////////////////////////////////////////////////////////////
// AJAX //
// var sys = require("sys");
var stdin = process.openStdin();
// var stdin = process.stdin();
// stdin.resume();
stdin.setEncoding('utf8');

//////////////////////////////////////////////////////////////////////////
// AJAX event
// stdin listener, listen to data coming from UI browser.
stdin.on('data', function (data) {
	// inputData = data;//.toString().trim();
	// // inputData = JSON.parse(data);

	// // Parse JSON data
	// var parsedData = JSON.parse(inputData);

	// // stdout, send it back to UI browser.
	// if (parsedData.CmdDest === "SCHD") {
	// 	// connect socket
	// 	client.connect(PORT, HOST);
	// 	// console.log(JSON.stringify({"message": "Direction to SCHD"}));
	// 	// send to scheduler through socket
	// 	client.write(inputData);
	// 	// server log
	// 	var message = "Connect Socket. Send data through Socket to scheduler. " + JSON.stringify(parsedData);
	// 	var now = moment();
	// 	log.fileExist(now);
	// 	log.appendToFile(now, message);
	// 	log.checkFileCreatedTime(now);
	// }
	// else if (parsedData.CmdDest === "APACHE") {
	// 	// console.log(JSON.stringify({"message": "Direction to DB"}));
	// 	var now = moment();
	// 	log.fileExist(now);
	// 	log.appendToFile(now, parsedData.Message);
	// 	log.renameAndSave(now);
	// }
	// else
	// 	console.log(JSON.stringify({"message": "Other, might be error"}));


	// // server log
	// var message = "AJAX event receive from UI. " + JSON.stringify(JSON.parse(inputData));
	// var now = moment();
	// log.fileExist(now);
	// log.appendToFile(now, message);
	// log.checkFileCreatedTime(now);
	fs.readFile(data, 'utf8', function (err,data) {
		if (err) {
		  return console.log(err);
		}
		console.log(toString(data));
	});
});