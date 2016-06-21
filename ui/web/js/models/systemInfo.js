//create a model 
var systemInfo = Backbone.Model.extend({ 
	//set default values of property 
	defaults: { 
		sysStatus: "",
		station: [],
		recipe: "",
		sysMsg:[],
		robotMsg:[],
		secsgemMsg:[],
        websocket:null,        // Websocket
	},

	initialize: function() {
		// this.set({sysStatus:this.statusInit()})
		this.set({station:this.stationInit()})
		// this.set({sysMsg:this.sysmsgInit()})
		// this.set({robotMsg:this.robotmsgInit()})
		// this.set({secsgemMsg:this.secsgemmsgInit()})
		console.log('system model has been intialized');

	    // Websocket init
        this.set({websocket:this.websocketinit()})
		console.log('Websocket has been intialized');

        // Hook up some event handlers to listen to model change
        this.on('change',  function() {
            if(this.hasChanged('sysStatus')){
                console.log('sysStatus has been changed');
            }
            if(this.hasChanged('station')){
                console.log('stationMapping has been changed');
            }
            if(this.hasChanged('recipe')){
                console.log('loaded recipe has been changed');
            }
        });
	},
	// Init
	stationInit : function() { 
		var slotMap = new Array()
		var stationCount = 8	// dynamic load station count
		for (var i = 0; i < stationCount; i++) {
			slotMap.push(
			{
				stationID: i+1,
				map: Array.apply(null, Array(25)).map( function(){return 0}),
				waferID: Array.apply(null, Array(25)).map(function(){return null})
			})
		}
		return slotMap
	},

	statusInit: function() {
		return "idle"
	},
	sysmsgInit: function() {
		return new Array
	},	
	robotmsgInit: function() {
		return new Array
	},	
	secsgemmsgInit: function() {
		return new Array
	},

	getStation: function(stn) {
		var stnInfo = this.get('station')
		return stnInfo[stn-1];
	},

	getMap: function(stn) {
		return stn.get('map')
	},

	mapChange : function(stn, status) {
		if (stn !== this.station[stn-1].station) {
			alert('Erroring: map storing error!')
		}
		else {
			alert('re-map station '+stn); 
		}
	}, 

	singleSlotChange : function(stn, index, status) { 
		if (stn !== this.station[stn-1].station) {
			alert('Erroring: map storing error!')
		}
		else {
			if (this.station[stn-1].map[index] !== status) {
				this.station[stn-1].map[index] = status
				alert('re-map station'+stn); 
			}
			else
				alert('slot mapping warning')
		}
		alert('single slot changed'); 
	},

	updateSlotID: function() {

	},

	show: function() {
		console.log(JSON.stringify(this));
	},

	// websocket init
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