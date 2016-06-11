// TODO
// websocket model 
var websocket = Backbone.Model.extend({ 
	//set default values of property 
	defaults: { 

	},

	initialize: function() {
		/////////////////////////////////////////////////////////////////////////////////////
        // WebSocket
        // if user is running mozilla then use it's built-in WebSocket
        window.WebSocket = window.WebSocket || window.MozWebSocket;

        // if browser doesn't support WebSocket, just show some notification and exit
        if (!window.WebSocket) {
            console.log("Sorry, but your browser doesn't support WebSockets.")
            return;
        }

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

        // WebSocket
        //////////////////////////////////////////////////////////////////////////////
	},
	 

});