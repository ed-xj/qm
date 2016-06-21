window.BaseView = Backbone.View.extend({

    initialize:function (moderator) {
        this.moderator = moderator;
    },

    ajaxCall: function(ajaxUrl, json, msg, succCallback, errCallback) {
        ///////////////////////////////////////////////////////////////////////////////////
        // AJAX 
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
        // AJAX
        /////////////////////////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////////////////////////////
        // WebSocket
        // var connection = false
        // // if user is running mozilla then use it's built-in WebSocket
        // window.WebSocket = window.WebSocket || window.MozWebSocket;

        // // // if browser doesn't support WebSocket, just show some notification and exit
        // if (!window.WebSocket) {
        //     console.log('Sorry, but your browser doesn support WebSockets.')
        //     return;
        // }

        // Besure that websocket is on, otherwise it will fail to reconnect.
        var connection = this.moderator.get("websocket")

        // send the message as an ordinary text
        if (connection.readyState === connection.OPEN) {
            connection.send(JSON.stringify(json));
            console.log("Websocket message sent.")
        }
        
        // WebSocket open event listener
        connection.onopen = function () {
            console.log("Websocket open.")
            connection.send(JSON.stringify(json));
        };

        // WebSocket error event listener
        connection.onerror = function (error) {
            alert("Websocket ERROR. Please reload this page.")
            // just in there were some problems with conenction...
            console.log("Websocket error. " + error)
            this.moderator.set("websocket", false);
            if (errCallback) errCallback(error);
        };

        // WebSocket message event listener
        // most important part - incoming messages
        connection.onmessage = function (message) {
            var msg = JSON.parse(message.data)
            console.log("websocket receive msg. " + JSON.stringify(msg))
            // this.decodeJSON()
            if (succCallback) succCallback(msg);
        };

        // WebSocket message event listener
        // most important part - incoming messages
        connection.onclose = function () {
            alert("Websocket Close. Please reload this page.")
            this.moderator.set("websocket", false)
            console.log("Websocket close.")
        };


        // setInterval(function() {
        //     if (connection.readyState !== 1) {
        //         console.log("Unable to comminucate with the WebSocket server.");
        //     }
        // }, 3000);
        // WebSocket
        //////////////////////////////////////////////////////////////////////////////
    },

    systemStatus: function() { 

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

    decodeJSON: function (json) {
        if (json.CmdDest==="UI") {
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
                case "UPDATE":
                    break;
            }
        };
    }
});