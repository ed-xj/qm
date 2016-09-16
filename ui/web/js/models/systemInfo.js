//create a model 
var systemInfo = Backbone.Model.extend({ 
	//set default values of property 
	defaults: { 
		sysStatus: "",
		station: [],
		recipe: {},
		sysMsg:[],
		robotMsg:[],
		secsgemMsg:[],
        websocket:null,        // Websocket
	},

	initialize: function() {
		this.set({station:this.stationInit()})
		this.set({sysMsg:this.sysmsgInit()})
		this.set({robotMsg:this.robotmsgInit()})
		this.set({secsgemMsg:this.secsgemmsgInit()})
		console.log('system model has been intialized');

		// Recipe init
		this.set({recipe:this.recipeInit()})
		console.log('Recipe template has been intialized');

	    // Websocket init
        this.set({websocket:this.websocketinit()})
		console.log('Websocket has been intialized');

        // Hook up some event handlers to listen to model change
        // this.on('change',  function() {
        //     if(this.hasChanged('station')){
        //         console.log('stationMapping has been changed');
        //     }
        //     if(this.hasChanged('recipe')){
        //         console.log('loaded recipe has been changed');
        //     }
        // });
		// change event
        // this.on('change:cas', this.notify, this);
        // this.on('change', this.notifyGeneral, this);
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

	sysmsgInit: function() {
		return new Array
	},	
	robotmsgInit: function() {
		return new Array
	},	
	secsgemmsgInit: function() {
		return new Array
	},

	recipeInit: function() {
		return {
            "name":"",
            "loop_enable":"",
            "robot_type":"",
            "source":{
                "order":"",
                "source":"",
                "index":new Array()
            },
            "destination":{
                "order":"",
                "source":"",
                "index":new Array()
            },
            "type":"",
            "process1":{
                "usage":"",
                "sequence":new Array
                // "sequence":[{"CMD":"1","DATA":"222","GOTO":"3"}]
            },
            "process2":{
                "usage":"",
                "sequence":new Array
                // "sequence":[{"CMD":"1","DATA":"222","GOTO":"3"}]
            },
            "pre_process1":{
                "usage":"",
                "sequence":new Array
                // "sequence":[{"CMD":"1","DATA":"222","GOTO":"3"}]
            },
            "pre_process2":{
                "usage":"",
                "sequence":new Array
                // "sequence":[{"CMD":"1","DATA":"222","GOTO":"3"}]
            }
        }
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

    readRecipe: function (event) {
        var reader = new FileReader();
        reader.onload = function(event) {
            // The file's text will be printed here
            // console.log(event.target.result)

            // parsing recipe file
            var text = event.target.result;
            var lines = text.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
            for (var i = 0; i < lines.length; i++) {
                this.parseRecipeLines(lines[i])
            }
            alert("read recipe complete!")
        };
        reader.readAsText(event.target.files[0], "UTF-8");
    },

	// confirm with JD.
    parseRecipeLines: function (line) {
        line = line.split("=")
        if (line[0] === "ROBOT_TYPE") {
            switch (line[1]) {
                case "NONE":
                    break;
                case "SINGLE":
                    break;
                case "DUAL":
                    break;
                case "BATCH":
                    break;
                default:
                    alert()
                    return
            }
        } else if (line[0] === "SOURCE_UNLOAD_ORDER") {
            switch (line[1]) {
                case "BOTTOM - TOP":
                    this.recipe.source.order = "b2t"
                    break;
                case "TOP - BOTTOM":
                    this.recipe.source.order = "t2b"
                    break;
                default:
                    alert("UNABLE TO LOAD RECIPE. INVALID SOURCE STATION.")
                    return;
            }
        } else if (line[0] === "STATION_UNLOAD_NAME") {
            // TODO 7/14 
            //GET ALL INPUT STATION AND COMPARE IF STATION IS AVAILABLE
            this.recipe.source.source = line[1]
        } else if (line[0] === "SOURCE_UNLOAD_SLOTS") {
            // for (var i = 0; i < Things.length; i++) {
            //     Things[i]
            // };
        } else if (line[0] === "SOURCE_UNLOAD_ALIGNER") {
            switch (line[1]) {
                case "STD":
                    break;
                case "THIN":
                    break;
                case "A_TYPE":
                    break;
                case "B_TYPE":
                    break;
                case "NONE":
                    break;
                case "TYPE 1":
                    break;
                default:
                    alert("UNABLE TO LOAD RECIPE. INVALID SOURCE STATION.")
                    return
            }
        } else if (line[0] === "SOURCE_LOAD_ORDER") {
            switch (line[1]) {
                case "BOTTOM - TOP":
                    this.recipe.destination.order = "b2t"
                    break;
                case "TOP - BOTTOM":
                    this.recipe.destination.order = "t2b"
                    break;
                default:
                    alert("UNABLE TO LOAD RECIPE. INVALID FINISH STATION.")
                    return;
            }
        } else if (line[0] === "STATION_LOAD_NAME") {
            // TODO 7/14 
            //GET ALL INPUT STATION AND COMPARE IF STATION IS AVAILABLE
            this.recipe.destination.source = line[1]
        } else if (line[0] === "SOURCE_LOAD_SLOTS") {
            // for (var i = 0; i < Things.length; i++) {
            //     Things[i]
            // };
        } else if (line[0] === "SOURCE_LOAD_ALIGNER") {
        } else if (line[0] === "LOOP_ENABLE") {
            switch(line[1]) {
                case "ENABLE":
                    break;
                case "DISABLE":
                    break;
                default:
                    alert("UNABLE TO LOAD RECIPE. INVALID PROCESS 1 LOOP ENABLE TYPE.")
            }
        } else if (line[0] === "PROCESS_1_ENABLE") {
            switch(line[1]) {
                case "ENABLE":
                    this.recipe.process1.usage = 1
                    break;
                case "DISABLE":
                    this.recipe.process1.usage = 0
                    break;
                default:
                    alert("UNABLE TO LOAD RECIPE. INVALID PROCESS 1 ENABLE TYPE.")
            }
        } else if (line[0] === "PROCESS_2_ENABLE") {
            switch(line[1]) {
                case "ENABLE":
                    this.recipe.process2.usage = 1
                    break;
                case "DISABLE":
                    this.recipe.process2.usage = 0
                    break;
                default:
                    alert("UNABLE TO LOAD RECIPE. INVALID PROCESS 2 ENABLE TYPE.")
            }
        } else if (line[0] === "PROCESS_3_ENABLE") {
            switch(line[1]) {
                case "ENABLE":
                    // recipe.process3.usage = 1
                    break;
                case "DISABLE":
                    // recipe.process3.usage = 0
                    break;
                default:
                    alert("UNABLE TO LOAD RECIPE. INVALID PROCESS 3 ENABLE TYPE.")
            }
        } else if (line[0] === "PROCESS_1_RECIPE") {
            // {"CMD":"1","DATA":"222","GOTO":"3"}
            var p = line[1].split("#")
            this.recipe.process1.sequence.push({"NUM":p[0],"CMD":p[1],"DATA":p[2],"GOTO":p[3]})

        } else if (line[0] === "PROCESS_2_RECIPE") {
            var p = line[1].split("#")
            this.recipe.process2.sequence.push({"NUM":p[0],"CMD":p[1],"DATA":p[2],"GOTO":p[3]})

        } else if (line[0] === "PROCESS_3_RECIPE") {
            var p = line[1].split("#")

        } else if (line[0] === "PRE_PROCESS_1_ENABLE") {
            switch(line[1]) {
                case "ENABLE":
                    // recipe.process3.usage = 1
                    break;
                case "DISABLE":
                    // recipe.process3.usage = 0
                    break;
                default:
                    alert("UNABLE TO LOAD RECIPE. INVALID PRE PROCESS 1 ENABLE TYPE.")
            }
        } else if (line[0] === "POST_PROCESS_1_ENABLE") {
            switch(line[1]) {
                case "ENABLE":
                    // recipe.process3.usage = 1
                    break;
                case "DISABLE":
                    // recipe.process3.usage = 0
                    break;
                default:
                    alert("UNABLE TO LOAD RECIPE. INVALID POST PROCESS 1 ENABLE TYPE.")
            }
        } else if (line[0] === "PRE_PROCESS_1_RECIPE") {
            var pre_p = line[1].split("#")
        } else if (line[0] === "POST_PROCESS_1_RECIPE") {
            var post_p = line[1].split("#")
        }
    },

	// websocket init
	websocket_addr:"localhost:5000",

	websocketinit : function() {
        // if user is running mozilla then use it's built-in WebSocket
        window.WebSocket = window.WebSocket || window.MozWebSocket;

        // if browser doesn't support WebSocket, just show some notification and exit
        if (!window.WebSocket) {
            console.log('Sorry, but your browser doesn support WebSockets. Please change to another browser.\nFirefox 7-9 (Old) (Protocol Version 8)\nFirefox 10+ (Protocol Version 13)\nChrome 14,15 (Old) (Protocol Version 8)\nChrome 16+ (Protocol Version 13)\nInternet Explorer 10+ (Protocol Version 13)\nSafari 6+ (Protocol Version 13)')
        }

        ws = new WebSocket('ws://'+this.websocket_addr,"qm-tool-protocol");  // Error detect

        // WebSocket error event listener
        ws.onerror = function (error) {
            alert("Websocket ERROR. Please RELOAD this page.")
            $("#statusBar>.btn[value='3']").css('opacity', '1.0');
            $("#statusBar>.btn[value='2']").css('opacity', '0.5');
            $("#statusBar>.btn[value='1']").css('opacity', '0.5');
        }
        return ws
    },
});