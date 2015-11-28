window.InputModel = Backbone.Model.extend({
    viewName: null
});

window.InputBaseView = window.BaseView.extend({
    model: null,

    initialize: function (moderator) {
        this.moderator = moderator;
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
        // clear slots color and text
        $("#slots").children().children("td").text("")
        $("#slots").children().children("td").removeAttr("style");
        // render slots color with yellow if there is a wafer
        for (i=0; i<map.length; i++) {
            if (map[i]===1) {
                var slot = "#slot"+(i+1); 
                $(slot).text(slot);
                $(slot).css("background-color","yellow");
                $(slot).css("box-shadow","2px 2px 2px #888888");
            }
        }
    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",

    callBack: function(data) {
        if (data.map === true) {
            if (data.message.length !== 25)
                alert("Mapping Error, slot count is not correct");
            else {
                var v = new InputBaseView();
                v.slotMapping(data.Message);
            }
        }
    },

    openFoupBtnCLick: function () {
        // Build up JSON
        console.log("model:" + this.model.viewName);
        var json = encodeJSON("SCHD", "COMMAND", this.model.viewName, "OPENFOUP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "openFoup", this.callBack);
    },

    closeFoupBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.viewName, "CLOSEFOUP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "closeFoup", this.callBack);
    },

    loadCasetteBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.viewName, "LOADCASETTE", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "loadCasette", this.callBack);
    },

    unloadCasetteBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.viewName, "UNLOADCASETTE", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "unloadCasette", this.callBack);
    },

    openDoorBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "OPENFDOOR", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "openDoor", this.callBack);
    },

    closeDoorBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "CLOSEDOOR", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "closeDoor", this.callBack);
    },

    restoreDataBtnCLick: function () {
        // clear slots color and text
        $("#slots").children().children("td").text("");
        $("#slots").children().children("td").removeAttr("style");
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.viewName, "RESTOREDATA", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "restoreData", this.callBack);
    },

    getStandardBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.viewName, "GETSTANDARD", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getStandard", this.callBack);
    },

    putStandardBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.viewName, "PUTSTANDARD", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "putStandard", this.callBack);
    },

    mapStandardBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.viewName, "MAPSTANDARD", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "mapStandard", this.callBack);
    },

    getWrapBelowBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.viewName, "GETWRAPBELOW", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getWrapBelow", this.callBack);
    },

    putWrapBelowBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.viewName, "PUTWRAPBELOW", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "putWrapBelow", this.callBack);
    },

    mapWrapBelowBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.viewName, "MAPWRAPBELOW", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "mapWrapBelow", this.callBack);
    },

    getWrapAboveBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.viewName, "GETWRAPABOVE", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getWrapAbove", this.callBack);
    },

    putWrapAboveBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.viewName, "PUTWRAPABOVE", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "putWrapAbove", this.callBack);
    },

    mapWrapAboveBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.viewName, "MAPWRAPABOVE", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "mapWrapAbove", this.callBack);
    },

    slotClick: function (e) {
        var slotTarget = $(e.currentTarget);
        console.log('inputBase: slotClick');
    }
});