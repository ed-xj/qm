// TODO
//create a model 
var systemInfo = Backbone.Model.extend({ 
	//set default values of property 
	defaults: { 
		websocket:false,		// Websocket
		sysStatus: null,
		station: [],
		recipe: ""
	},

	initialize: function() {
		this.set({station:this.stationInit()})
		console.log('system model has been intialized');

		// Websocket init
		this.set({websocket:this.websocketinit()})
		console.log('websocket has been intialized');

        // Hook up some event handers to listen to model change
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

	websocketinit : function() {
        // if user is running mozilla then use it's built-in WebSocket
        window.WebSocket = window.WebSocket || window.MozWebSocket;

        // if browser doesn't support WebSocket, just show some notification and exit
        if (!window.WebSocket) {
            console.log('Sorry, but your browser doesn support WebSockets.')
            return;
        }

		return new WebSocket('ws://localhost:5000');	// Error detect
	},
	 
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

	systemStatus: function () {
		
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
			alert('re-mapping station '+stn); 
		}
	}, 

	singleSlotChange : function(stn, index, status) { 
		if (stn !== this.station[stn-1].station) {
			alert('Erroring: map storing error!')
		}
		else {
			if (this.station[stn-1].map[index] !== status) {
				this.station[stn-1].map[index] = status
				alert('re-mapping station'+stn); 
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
	}
});