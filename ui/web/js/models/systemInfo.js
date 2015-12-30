// TODO
//create a model 
var systemInfo = Backbone.Model.extend({ 
	//set default values of property 
	defaults: { 
		sysStatus : null,
		station: []
	},

	initialize: function() {
		this.set({station:this.stationInit()})
		console.log('system model has been intialized');

        // Hook up some event handers to listen to model change
        this.on('change',  function() {
            if(this.hasChanged('sysStatus')){
                console.log('sysStatus has been changed');
            }
            if(this.hasChanged('station')){
                console.log('stationMapping has been changed');
            }
        });
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