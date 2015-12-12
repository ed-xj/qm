window.InputModel = Backbone.Model.extend({
    viewName: null
});

window.InputBaseView = window.BaseView.extend({
    model: null,

    initialize: function (moderator) {
        this.moderator = moderator;
        this.slotTarget = null;
        // this.stationID = 
    },

    handleWaferTypeChange: function() {
        var waferType = $("#waferType").val();
        $("#getWaferTypeLabel").text("GET " + waferType);
        $("#getWaferType").text("GET " + waferType);
        $("#putWaferTypeLabel").text("PUT " + waferType);
        $("#putWaferType").text("PUT " + waferType);
        $("#mapWaferTypeLabel").text("MAP " + waferType);
        $("#mapWaferType").text("MAP " + waferType);
    },

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

    // Union function
    callBack: function(data) {
        if (data.Cmd === "MAPPING") {
            var v = new InputBaseView();
            if (data.Param.index === 0) {
                if (data.Param.status.length !== 25)
                    alert("Mapping Error, slot count is not correct");
                else {
                    // var v = new InputBaseView();
                    v.slotMapping(data.Param.status);
                }
            } else {
                var slot = "#slot"+(data.Param.index);
                if (data.Param.index < 1 ||  data.Param.index >50)
                    alert("Mapping Error, slot count is not correct");
                else {
                    if (data.Param.status === 1) {
                        // var v = new InputBaseView();
                        $(slot).css("background-color","yellow");
                        $(slot).css("box-shadow","2px 2px 2px #888888");
                    } else {
                        $(slot).text("");
                        $(slot).removeAttr("style");
                    }
                }
            }
        } else {}
    },

    openFoupBtnCLick: function () {
        // Build up JSON
        console.log("model:" + this.model.get('viewName'));
        var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "OPENFOUP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "openFoup", this.callBack);
    },

    closeFoupBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "CLOSEFOUP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "closeFoup", this.callBack);
    },

    loadCasetteBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "LOADCASETTE", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "loadCasette", this.callBack);
    },

    unloadCasetteBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "UNLOADCASETTE", null, null);
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
        var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "RESTOREDATA", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "restoreData", this.callBack);
    },

    updateIdBtnCLick: function () {
        // TODO
        console.log("updateIdBtnCLick");
    },

    getWaferTypeBtnCLick: function () {
        // Build up JSON
        if (this.slotTarget !== null) {
            var slotindex = this.slotTarget.siblings('th').text();
            var mapparam = {
                    "index": Number(slotindex),
                    "status": null,
                    "waferID": null
                };
            var action = "GET" + $("#waferType").val();
            var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), action, mapparam, null);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "getStandard", this.callBack);
        } else {
            alert("Slot select fail.");
        }
    },

    putWaferTypeBtnCLick: function () {
        // Build up JSON
        if (this.slotTarget !== null) {
            var slotindex = this.slotTarget.siblings('th').text();
            var mapparam = {
                    "index": Number(slotindex),
                    "status": null,
                    "waferID": null
                };
            var action = "PUT" + $("#waferType").val();
            var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), action, mapparam, null);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "putStandard", this.callBack);
        } else {
            alert("Slot select fail.");
        }
    },

    mapWaferTypeBtnCLick: function () {
        // Build up JSON
        var action = "MAP" + $("#waferType").val();
        var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), action, null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "mapStandard", this.callBack);
    },

    // To be removed after wafer type change for all input view.
    // START >>
    getStandardBtnCLick: function () {
        // Build up JSON
        if (this.slotTarget !== null) {
            var slotindex = this.slotTarget.siblings('th').text();
            var mapparam = {
                    "index": Number(slotindex),
                    "status": null,
                    "waferID": null
                };
            var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "GETSTANDARD", mapparam, null);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "getStandard", this.callBack);
        } else {
            alert("Slot select fail.");
        }
    },

    putStandardBtnCLick: function () {
        // Build up JSON
        if (this.slotTarget !== null) {
            var slotindex = this.slotTarget.siblings('th').text();
            var mapparam = {
                    "index": Number(slotindex),
                    "status": null,
                    "waferID": null
                };
            var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "PUTSTANDARD", mapparam, null);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "putStandard", this.callBack);
        } else {
            alert("Slot select fail.");
        }
    },

    mapStandardBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "MAPSTANDARD", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "mapStandard", this.callBack);
    },

    getWrapBelowBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "GETWRAPBELOW", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getWrapBelow", this.callBack);
    },

    putWrapBelowBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "PUTWRAPBELOW", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "putWrapBelow", this.callBack);
    },

    mapWrapBelowBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "MAPWRAPBELOW", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "mapWrapBelow", this.callBack);
    },

    getWrapAboveBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "GETWRAPABOVE", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getWrapAbove", this.callBack);
    },

    putWrapAboveBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "PUTWRAPABOVE", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "putWrapAbove", this.callBack);
    },

    mapWrapAboveBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "MAPWRAPABOVE", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "mapWrapAbove", this.callBack);
    },
    // END <<

    slotClick: function (e) {
        this.slotTarget = $(e.currentTarget);
        var selected_slot = this.slotTarget.parent().parent().children();
        if (this.slotTarget.parent().hasClass('selected')) {
            this.slotTarget.parent().removeClass('selected');
            console.log('inputBase: '+this.model.get('viewName')+', slot: '+ this.slotTarget.attr('id')+' unselected.');
            this.slotTarget = null;
        } else {
            selected_slot.removeClass('selected');
            this.slotTarget.parent().addClass('selected');
            console.log('inputBase: '+this.model.get('viewName')+', slot: '+ this.slotTarget.attr('id')+' selected.');
        }
    },

    slotIdDblCkick: function(e) {
        var th = $(e.currentTarget);
        th.find('label').hide();
        th.find('input[type="text"]').show().focus();
    },

    slotIdDblCkick: function(e) {
        var th = $(e.currentTarget);
        th.find('.wafer-id').hide();
        th.find('.wafer-id-input').val(th.find('.wafer-id').text());
        th.find('.wafer-id-input').show().focus();
        th.find('.wafer-id-input').select();
    },

    handleWaferIdChange: function(e) {
        var text = $(e.currentTarget);
        text.hide();
        var th = $(e.currentTarget).parent();
        th.find('.wafer-id').text(text.val());
        th.find('.wafer-id').show();
    }
});