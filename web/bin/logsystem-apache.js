// logsystem-apache.js
// server side (Apache) logging system.

const fs = require('fs');
var moment = require('./moment.js');

// var now = moment();
// var timestamp = String(now.format('YYYY-MM-DD HH:mm:ss '));
// var filename = String(now.format('YYYY-MM-DD'));

// function writeToFile(date,string) {
// 	fs.writeFile("../log/templog.txt", "\r\n"+timestamp+string, function(err) {
// 	    if(err) {
// 	        // return console.log(err);
// 	    }

// 	    // console.log("The file was saved!");
// 	}); 
// }

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

// // zip file
// var fs = require("fs");
// var zlib = require('zlib');

// // Compress the file input.txt to input.txt.gz
// fs.createReadStream('input.txt')
//   .pipe(zlib.createGzip())
//   .pipe(fs.createWriteStream('input.txt.gz'));
  
// console.log("File Compressed.");


// // removing first line
// var Transform = require('stream').Transform;
// var util = require('util');
// // Transform sctreamer to remove first line
// function RemoveFirstLine(args) {
//     if (! (this instanceof RemoveFirstLine)) {
//         return new RemoveFirstLine(args);
//     }
//     Transform.call(this, args);
//     this._buff = '';
//     this._removed = false;
// }
// util.inherits(RemoveFirstLine, Transform);

// RemoveFirstLine.prototype._transform = function(chunk, encoding, done) {
//     if (this._removed) { // if already removed
//         this.push(chunk); // just push through buffer
//     } else {
//         // collect string into buffer
//         this._buff += chunk.toString();

//         // check if string has newline symbol
//         if (this._buff.indexOf('\n') !== -1) {
//             // push to stream skipping first line
//             this.push(this._buff.slice(this._buff.indexOf('\n') + 2));
//             // clear string buffer
//             this._buff = null;
//             // mark as removed
//             this._removed = true;
//         }
//     }
//     done();
// };


// // usage
// // var fs = require('fs');

// var input = fs.createReadStream("../log/"+filename+".txt"); // read file
// var output = fs.createWriteStream("../log/"+filename+".txt"); // write file

// input // take input
// .pipe(RemoveFirstLine()) // pipe through line remover
// .pipe(output); // save to file


// export
exports.appendToFile = appendToFile;
exports.fileExist = fileExist;
exports.checkFileCreatedTime = checkFileCreatedTime;
exports.renameAndSave = renameAndSave;