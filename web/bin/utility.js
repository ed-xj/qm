// utility.js

var log = require("./logsystem-apache.js")

// encode and decode JSON
// Build up JSON
var encodeJSON = function (dest, type, id, cmd, param, msg) {
	return json = {
		"CmdDest":dest,
		"CmdType":type,
		"StationID":id,
		"Cmd":cmd,
		"Param":param,
		"Message":msg,
	};
};

// var json = {
// 		"CmdDest":SCHD / UI / DB,
//      "CmdType":"cmdtype",
//      "StationID":"stationid",
//		"Cmd":"command",
// 		"Param":"parameters (could be any type)",
// 		"Message":"some messages"
//     };
// decode JSON from Apache to UI
var decodeJSON = function (json, connection) {
	if (json.CmdDest==="SCHD") {
		switch (json.CmdType) {
		    case "ERROR":
		        break;
		    case "MAPPING":
		        break;
		    case "STATUS":
		        break;
		    case "RECIPE":
		        break;
		    case "COMMAND":
			    break;
		}
	} else if (json.CmdDest==="UI") {
		switch (json.CmdType) {
		    case "ERROR":
		        break;
		    case "MAPPING":
		        break;
		    case "STATUS":
		        break;
		    case "RECIPE":
		        break;
		    case "COMMAND":
			    break;
		}
	} else {
		switch (json.CmdType) {
		    case "LOG":
		    	if (json.Cmd === "getdirectory") {
		    		var logfiles = log.getLogDirectory(json.Param)
		    		var resp = this.encodeJSON("UI", "LOG", "log", "UPDATE", logfiles, "Apache /log/ directory.")
					// send back to UI
		    		connection.sendUTF(JSON.stringify(resp)); 
		    	}
		    	if (json.Cmd === "getlogfile") {
		    		var file = log.getLogFile(json.Param)
		    		var resp = this.encodeJSON("UI", "LOG", "log", "LOGFILE", file, "Apache /log/ directory.")
			    	// send back to UI
		    		connection.sendUTF(JSON.stringify(resp)); 
		    	}
		    break;
	    }
	}
};

// for Apache use
	exports.encodeJSON = encodeJSON;
	exports.decodeJSON = decodeJSON;