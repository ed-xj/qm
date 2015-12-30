window.InputModel = Backbone.Model.extend({
    viewName: null
});

window.InputBaseView = window.BaseView.extend({
    model: null,

    initialize: function (moderator) {
        this.moderator = moderator;
        this.slotTarget = null;
        this.myMap = null;
    },

    getStation: function() {
        var index = +this.model.get('viewName')[this.model.get('viewName').length-1] - 1;
        return this.moderator.get('station')[index];
    },

    handleWaferTypeChange: function() {
        var station = this.getStation();
        var waferType = $("#waferType").val();
        $("#getWaferTypeLabel").text("GET " + waferType);
        $("#getWaferType").text("GET " + waferType);
        $("#putWaferTypeLabel").text("PUT " + waferType);
        $("#putWaferType").text("PUT " + waferType);
        $("#mapWaferTypeLabel").text("MAP " + waferType);
        $("#mapWaferType").text("MAP " + waferType);
        console.log("wafer type: " + waferType+' slot Map:'+ JSON.stringify(station));
    },

    handleCassetteChange: function() {
        var cassette = $('#cassette-type').val()       // type string
        console.log("handleCassetteChange: "+ cassette);
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    },

    slotMapping: function (data) {
        var map = data.status
        var waferid = data.waferID 
        // clear slots color and text
        $(".wafer-id").text("")
        $("#slots").children().children("td").removeAttr("style");
        // render slots color with yellow if there is a wafer
        for (i=0; i<map.length; i++) {
            if (map[i]===1) {
                var slot = "#slot"+(i+1); 
                $(slot).children('label').text(waferid[i]); //waferid
                $(slot).addClass('full');
            }
        }
        // update mapping info
    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",

    // Union function
    callBack: function(data) {
        if (data.Cmd === "MAPPING") {
            if (data.Param.index === 0) {
                if (data.Param.status.length !== 25)
                    alert("Mapping Error, slot count is not correct");
                else {
                    var v = new InputBaseView();
                    v.slotMapping(data.Param);
                    // update mapping info
                }
            } else {
                var slot = "#slot"+(data.Param.index);
                if (data.Param.index < 1 ||  data.Param.index >50)
                    alert("Mapping Error, slot count is not correct");
                else {
                    if (data.Param.status === 1) {
                        $(slot).children('label').text(slot);
                        $(slot).addClass('full');
                        // update mapping info
                    } else {
                        $(slot).children('label').text("");
                        $(slot).removeClass('full');
                        // update mapping info
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
        $(".wafer-id").text("")
        $("#slots").children().children("td").removeClass("full");
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "RESTOREDATA", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "restoreData", this.callBack);
    },

    updateIdBtnCLick: function () {
        // TODO
        var waferIDArray = new Array();
        $(".wafer-id").each(function(){
            waferIDArray.push($(this).text());
        });
        console.log("updateIdBtnCLick. id:" + waferIDArray.toString());
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "UPDATEID", waferIDArray, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "updateID", this.callBack);
        // update wafer id to systemInfo
        this.getStation().waferID = waferIDArray;
    },

    getWaferTypeBtnCLick: function () {
        // Build up JSON
        if (this.slotTarget !== null) {
            var mapparam = {
                    "index": Number(this.slotTarget.siblings('th').text()),
                    "status": null,
                    "waferID": this.slotTarget.children('.wafer-id').text()
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
            var mapparam = {
                    "index": Number(this.slotTarget.siblings('th').text()),
                    "status": null,
                    "waferID": this.slotTarget.children('.wafer-id').text()
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
        var td = $(e.currentTarget);
        td.find('.wafer-id').hide();
        td.find('.wafer-id-input').val(td.find('.wafer-id').text());
        td.find('.wafer-id-input').show().focus();
        td.find('.wafer-id-input').select();
    },

    handleWaferIdChange: function(e) {
        var text = $(e.currentTarget);
        text.hide();
        var td = $(e.currentTarget).parent();
        td.find('.wafer-id').text(text.val());
        td.find('.wafer-id').show();
    }
});