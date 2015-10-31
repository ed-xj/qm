window.Input6View = Backbone.View.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
    },

    events : {
        // "change #lang": "changeLang",
        "change .cassette-type": "handleCassetteChange",
        "click #openFoup":"openFoupBtnCLick",           // open foup
        "click #closeFoup":"closeFoupBtnCLick",         // close foup
        "click #loadCasette":"loadCasetteBtnCLick",     // load casette
        "click #unloadCasette":"unloadCasetteBtnCLick", // unload casette
        "click #openDoor":"openDoorBtnCLick",           // open door
        "click #closeDoor":"closeDoorBtnCLick",         // close door
        "click #restoreData":"restoreDataBtnCLick",     // restore data
        "click #getStandard":"getStandardBtnCLick",     // get standard
        "click #putStandard":"putStandardBtnCLick",     // put standard
        "click #mapStandard":"mapStandardBtnCLick",     // map standard
        "click #getWrapBelow":"getWrapBelowBtnCLick",   // get wrap below
        "click #putWrapBelow":"putWrapBelowBtnCLick",   // put wrap below
        "click #mapWrapBelow":"mapWrapBelowBtnCLick",   // map wrap below
        "click #getWrapAbove":"getWrapAboveBtnCLick",   // get wrap above
        "click #putWrapAbove":"putWrapAboveBtnCLick",   // put wrap above
        "click #mapWrapAbove":"mapWrapAboveBtnCLick"    // map wrap above
    },

    // changeLang: function(event) {
    //     window.currentLang = event.target.value;
    //     this.moderator.trigger('lang:change');
    //     this.render();
    // },

    handleCassetteChange: function() {
        console.log("handleCassetteChange");
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    },


    ajaxCall: function(json, msg) {
    // ajaxCall: function(json, msg, callback) {
        var that = this;
        $.ajax({
            url: "/cgi-bin/tcp_socket_client.js",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(json),
            datatype: "json",
            success: function(data) {
                console.log("AJAX POST Sucess(" + msg + ")");
                console.log(data.message);
                if (data.map === true)
                    if (data.message.length !== 25)
                        alert("Mapping Error, slot count is not correct")
                    else
                        // callback(data)
                        that.slotMapping(data.message)
            },
            error: function(error) {
                console.log("Some error in fetching the notification");
            }
        });
    },

    slotMapping: function (map) {
        // clear slots color
        $("#slots").children().children("td").css("background-color","transparent");
        // render slots color with yellow if there is a wafer
        for (i=0; i<map.length; i++) {
            if (map[i]===1) {
                var slot = "#slot"+(i+1);
                $(slot).children("td").css("background-color","yellow"); 
            }
        }
    },

    openFoupBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"openFoup"
            };
        // AJAX POST
        this.ajaxCall(json, "openFoup");
        // this.ajaxCall(json, "openFoup", function(data){
        // });
    },

    closeFoupBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"closeFoup"
            };
        // AJAX POST
        this.ajaxCall(json, "closeFoup");
    },

    loadCasetteBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"loadCasette"
            };
        // AJAX POST
        this.ajaxCall(json, "loadCasette");
    },

    unloadCasetteBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"unloadCasette"
            };
        // AJAX POST
        this.ajaxCall(json, "unloadCasette");
    },

    openDoorBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"openDoor"
            };
        // AJAX POST
        this.ajaxCall(json, "openDoor");
    },

    closeDoorBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"closeDoor"
            };
        // AJAX POST
        this.ajaxCall(json, "closeDoor");
    },

    restoreDataBtnCLick: function () {
        $("#slots").children().children("td").css("background-color","transparent");
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"restoreData"
            };
        // AJAX POST
        this.ajaxCall(json, "restoreData");
    },

    getStandardBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"getStandard"
            };
        // AJAX POST
        this.ajaxCall(json, "getStandard");
    },

    putStandardBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"putStandard"
            };
        // AJAX POST
        this.ajaxCall(json, "putStandard");
    },

    mapStandardBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"mapStandard"
            };
        // AJAX POST
        this.ajaxCall(json, "mapStandard");
    },

    getWrapBelowBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"getWrapBelow"
            };
        // AJAX POST
        this.ajaxCall(json, "getWrapBelow");
    },

    putWrapBelowBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"putWrapBelow"
            };
        // AJAX POST
        this.ajaxCall(json, "putWrapBelow");
    },

    mapWrapBelowBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"mapWrapBelow"
            };
        // AJAX POST
        this.ajaxCall(json, "mapWrapBelow");
    },

    getWrapAboveBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"getWrapAbove"
            };
        // AJAX POST
        this.ajaxCall(json, "getWrapAbove");
    },

    putWrapAboveBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"putWrapAbove"
            };
        // AJAX POST
        this.ajaxCall(json, "putWrapAbove");
    },

    mapWrapAboveBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"mapWrapAbove"
            };
        // AJAX POST
        this.ajaxCall(json, "mapWrapAbove");
    }
});