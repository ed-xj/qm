// utility.js
// encode and decode JSON

module.exports = {
	// Build up JSON from UI to server
	encodeJSON: function (dest, type, id, cmd, param, msg, recipe) {
		return json = {
			"CmdDest":dest,
			"CmdType":type,
			"StationID":id,
			"Cmd":cmd,
			"Param":param,
			"Message":msg,
			"Recipe":recipe
		};
	},

	// var json = {
	// 		"CmdDest":SCHD / UI / DB,
	//      "CmdType":"cmdtype",
	//      "StationID":"stationid",
	//		"Error":true/false,
	//		"Status":"status",
	// 		"Param":"parameters (could be any type)",
	// 		"Message":"some messages"
	//     };
	// decode JSON from server to UI
	decodeJSON: function (json) {
		// Error msg
		if (json.Error) {
			console.log("Some ERROR occurred");
			return json.Message;
		} else {
			// System status
			if (CmdType === "status") {
				console.log("system status");
				return json.Param;
			}
			// System msg 
			else if (CmdType === "sysmsg") {
				console.log("system message");
				return json.Message;
			}
			// Mapping
			else if (CmdType === "mapping") {
				console.log("slot mapping");
				return json.Param;
			}
		}
	}
}