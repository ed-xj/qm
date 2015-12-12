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
//		"Cmd":"command",
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

// // Detecting browser
// var ua = navigator.userAgent;
// var msie = false;
// var ff = false;
// var chrome = false;

// //Javascript Browser Detection - Internet Explorer
// if (/MSIE (\d+\.\d+);/.test(ua)) //test for MSIE x.x; True or False
// {
//     var msie = (/MSIE (\d+\.\d+);/.test(ua)); //True or False
//     var ieversion = new Number(RegExp.$1); //gets browser version
//     alert("ie: " + msie + ' version:' + ieversion);
// }
// //Javascript Browser Detection - FireFox
// else if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.ua))//test for Firefox/x.x or Firefox x.x
// {
//     var ff = (/Firefox[\/\s](\d+\.\d+)/.test(navigator.ua)); //True or False
//     var ffversion = new Number(RegExp.$1) //gets browser version
//     alert("FF: " + ff + ' version:' + ieversion);
// }
// //Javascript Browser Detection - Chrome
// else if (ua.lastIndexOf('Chrome/') > 0) {
//     var version = ua.substr(ua.lastIndexOf('Chrome/') + 7, 2);
//     alert("chrome " + version);
// }
// //Javascript Browser Detection - Safari
// else if (ua.lastIndexOf('Safari/') > 0) {
//     var version = ua.substr(ua.lastIndexOf('Safari/') + 7, 2);
//     alert("Safari " + version);
// }
// else {
// 	// for Apache use
	exports.encodeJSON = encodeJSON;
	exports.decodeJSON = decodeJSON;
// }