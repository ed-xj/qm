// utility.js
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
//		"Status":"status",
// 		"Param":"parameters (could be any type)",
// 		"Message":"some messages"
//     };
// decode JSON from Apache to UI
var decodeJSON = function (json) {
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
	}
};

exports.encodeJSON = encodeJSON;
exports.decodeJSON = decodeJSON;