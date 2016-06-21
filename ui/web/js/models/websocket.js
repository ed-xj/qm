// TODO
// websocket model 
var websocket = Backbone.Model.extend({ 
	//set default values of property 
	defaults: { 
        websocket:false,        // Websocket
	},

	initialize: function() {
		      // Websocket init
        this.set({websocket:this.websocketinit()})
	},

    websocketinit : function() {
        // if user is running mozilla then use it's built-in WebSocket
        window.WebSocket = window.WebSocket || window.MozWebSocket;

        // if browser doesn't support WebSocket, just show some notification and exit
        if (!window.WebSocket) {
            console.log('Sorry, but your browser doesn support WebSockets. Please change to another browser.\nFirefox 7-9 (Old) (Protocol Version 8)\nFirefox 10+ (Protocol Version 13)\nChrome 14,15 (Old) (Protocol Version 8)\nChrome 16+ (Protocol Version 13)\nInternet Explorer 10+ (Protocol Version 13)\nSafari 6+ (Protocol Version 13)')
        }

        ws = new WebSocket('ws://localhost:5000',"qm-tool-protocol");  // Error detect

        // WebSocket error event listener
        ws.onerror = function (error) {
            alert("Websocket ERROR. Please RELOAD this page.")
        }
        return ws
    },
	 

});