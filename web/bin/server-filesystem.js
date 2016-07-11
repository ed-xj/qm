// log-filesystem.js
// server side (Apache) file system.

const fs = require('fs');
var moment = require('./moment.js');

// get log directory
function getLogDrectory(now, string) {
	var timestamp = String(now.format('YYYY/MM/DD HH:mm:ss >> '));
	fs.appendFileSync("../log/apache.txt", "\r\n"+timestamp+string);
}

// read file
function readLogFile(now, string) {
	var timestamp = String(now.format('YYYY/MM/DD HH:mm:ss >> '));
	fs.appendFileSync("../log/apache.txt", "\r\n"+timestamp+string);
}




function appendToFile(now, string) {
	var timestamp = String(now.format('YYYY/MM/DD HH:mm:ss >> '));
	fs.appendFileSync("../log/apache.txt", "\r\n"+timestamp+string);
}

function fileExist(now) {
	var timestamp = String(now.format('YYYY/MM/DD HH:mm:ss >> '));
	// fs.access("../log/"+filename+".txt", fs.F_OK, function (err) {
	fs.access("../log/apache.txt", fs.F_OK, function (err) {
		if(err) {	// if not exist apache.txt, create new apache.txt.
			var message = "This file was created at " + timestamp + "\r\n";
			fs.appendFileSync("../log/apache.txt", message);
		}
	});
}

function checkFileCreatedTime(now) {
	fs.stat('../log/apache.txt', function (err, stat) {
	    if (!err) {
	        if (stat.isFile()) {
				// compare two timestamp, file creation date and now
				var bd = moment(stat.birthtime);
				if (now.diff(bd, "days") >= 7) {	// if this file is created 15 days before, change filename and create a new templog file
					renameAndSave(now)
				}
			}
		}
	});
}

function renameAndSave(now) {
	var filename = String(now.format('YYYY_MM_DD__HH_mm_ss'));
	fs.renameSync('../log/apache.txt', '../log/archived_logs/'+ filename +'_apache.txt'); 
	fs.unlink('../log/apache.txt', function(err) {
	   if (err) {
		       return console.error(err);
		   	}
	});
}

// export
exports.appendToFile = appendToFile;
exports.fileExist = fileExist;
exports.checkFileCreatedTime = checkFileCreatedTime;
exports.renameAndSave = renameAndSave;