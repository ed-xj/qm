window.InputModel = Backbone.Model.extend({
    viewName: null
});

window.InputBaseView = window.BaseView.extend({
    model: null,

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

    slotMapping: function (map) {
        // clear slots color
        $("#slots").children().children("td").css("background-color","transparent");
        // render slots color with yellow if there is a wafer
        for (i=0; i<map.length; i++) {
            if (map[i]===1) {
                var slot = "#slot"+(i+1);
                //$(slot).children("td").css("background-color","yellow"); 
                $(slot).css("background-color","yellow");
            }
        }
    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",

    callBack: function(data) {
        if (data.map === true)
            if (data.message.length !== 25)
                alert("Mapping Error, slot count is not correct");
            else {
                var v = new InputBaseView();
                v.slotMapping(data.message);
            }
    },

    openFoupBtnCLick: function () {
        // Build up JSON
        console.log("model:" + this.model.viewName);
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"openFoup"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "openFoup", this.callBack);
    },

    closeFoupBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"closeFoup"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "closeFoup", this.callBack);
    },

    loadCasetteBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"loadCasette"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "loadCasette", this.callBack);
    },

    unloadCasetteBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"unloadCasette"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "unloadCasette", this.callBack);
    },

    openDoorBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"openDoor"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "openDoor", this.callBack);
    },

    closeDoorBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"closeDoor"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "closeDoor", this.callBack);
    },

    restoreDataBtnCLick: function () {
        $("#slots").children().children("td").css("background-color","transparent");
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"restoreData"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "restoreData", this.callBack);
    },

    getStandardBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"getStandard"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getStandard", this.callBack);
    },

    putStandardBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"putStandard"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "putStandard", this.callBack);
    },

    mapStandardBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"mapStandard"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "mapStandard", this.callBack);
    },

    getWrapBelowBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"getWrapBelow"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getWrapBelow", this.callBack);
    },

    putWrapBelowBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"putWrapBelow"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "putWrapBelow", this.callBack);
    },

    mapWrapBelowBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"mapWrapBelow"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "mapWrapBelow", this.callBack);
    },

    getWrapAboveBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"getWrapAbove"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getWrapAbove", this.callBack);
    },

    putWrapAboveBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"putWrapAbove"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "putWrapAbove", this.callBack);
    },

    mapWrapAboveBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"mapWrapAbove"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "mapWrapAbove", this.callBack);
    }
});