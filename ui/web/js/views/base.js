window.BaseView = Backbone.View.extend({
    ajaxCall: function(ajaxUrl, json, msg, succCallback, errCallback) {
        // $.ajax({
        //     url: ajaxUrl ||  "/cgi-bin/tcp_socket_client.js",
        //     type: "POST",
        //     contentType: "application/json",
        //     data: JSON.stringify(json),
        //     datatype: "json",
        //     success: function(data) {
        //         console.log("AJAX POST Sucess(" + msg + ")");
        //         console.log(data.Message);
        //         if (succCallback) succCallback(data);
        //     },
        //     error: function(error) {
        //         console.log("AJAX ERROR, some error in fetching the notification.");
        //         console.log(error);
        //         if (errCallback) errCallback(error);
        //     },
        //     complete: function() {
        //         // do something after ajax call complete
        //     }
        // });


        /////////////////////////////////////////////////////////////////////////////////////
        // WebSocket
        // if user is running mozilla then use it's built-in WebSocket
        window.WebSocket = window.WebSocket || window.MozWebSocket;

        // // if browser doesn't support WebSocket, just show some notification and exit
        // if (!window.WebSocket) {
        //     console.log('Sorry, but your browser doesn support WebSockets.')
        //     return;
        // }

        // TODO : This line should be moved to global variable.
        // open connection
        var connection = new WebSocket('ws://localhost:5000');
        
        // send the message as an ordinary text
        if (connection.readyState === connection.OPEN) {
            connection.send(JSON.stringify(json));
            console.log("msg sent.")
        }
        
        // WebSocket open event listener
        connection.onopen = function () {
            console.log("Wbsocket open.")
            connection.send(JSON.stringify(json));
        };

        // WebSocket error event listener
        connection.onerror = function (error) {
            // just in there were some problems with conenction...
            console.log("Websocket error. " + error)
            if (errCallback) errCallback(error);
        };

        // WebSocket message event listener
        // most important part - incoming messages
        connection.onmessage = function (message) {
            var msg = JSON.parse(message.data)
            console.log("websocket receive msg. " + JSON.stringify(msg))
            if (succCallback) succCallback(msg);
        };

        // setInterval(function() {
        //     if (connection.readyState !== 1) {
        //         console.log("Unable to comminucate with the WebSocket server.");
        //     }
        // }, 3000);
        // WebSocket
        //////////////////////////////////////////////////////////////////////////////
    },

    // long polling
    systemStatus: function() { 
        var GUI_LOG_URL = "/cgi-bin/system_status.js"
        $.ajax({ url: GUI_LOG_URL, success: function(data){
            //Update your dashboard gauge
            // salesGauge.setValue(data.value);
        }, dataType: "json", complete: systemStatus, timeout: 30000 }); 
    },

    // JSON encode and decode
    encodeJSON: function(dest, type, id, cmd, param, msg) {
        return json = {
            "CmdDest":dest,
            "CmdType":type,
            "StationID":id,
            "Cmd":cmd,
            "Param":param,
            "Message":msg,
        };
    },

    // decodeJSON = function (json) {
    //     if (json.CmdDest==="SCHD") {
    //         switch (json.CmdType) {
    //             case "ERROR":
    //                 break;
    //             case "MAPPING":
    //                 break;
    //             case "STATUS":
    //                 break;
    //             case "RECIPE":
    //                 break;
    //             case "COMMAND":
    //                 break;
    //         }
    //     } else if (json.CmdDest==="UI") {
    //         switch (json.CmdType) {
    //             case "ERROR":
    //                 break;
    //             case "MAPPING":
    //                 break;
    //             case "STATUS":
    //                 break;
    //             case "RECIPE":
    //                 break;
    //             case "COMMAND":
    //                 break;
    //         }
    //     }
    // }
});