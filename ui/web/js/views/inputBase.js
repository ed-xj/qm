window.InputModel = Backbone.Model.extend({
    viewName: null
});

window.InputBaseView = window.BaseView.extend({
    model: null,

    initialize: function (moderator) {
        this.moderator = moderator;
        this.slotTarget = null;
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
        // $('tr td').removeAttr('class');
        // $('tr td:odd').children('.wafer-id').text("");
        var cassette = $('#cassette-type').val().toUpperCase()       // type string
        if (cassette.search("CASSETTE") >= 0 || cassette.search("CASS") >= 0) {
            $("#cassette-btn-group").show()
            $("#foup-btn-group").hide()
        } else {
            $("#foup-btn-group").show()
            $("#cassette-btn-group").hide()
        }

        if (cassette.search("13") >= 0) {
            $('tr td:odd').addClass('disable');
            // $('tr td:odd').children('.wafer-id').text("Unavailable");
            for (var i =  1; i <25; i+=2) {
                this.getStation().map[i] = "X";
                this.getStation().waferID[i] = "X";
            };
        } else {
            $('.disable').children('.wafer-id').text("")
            $('.disable').removeClass('disable')
        }
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
        // $(".wafer-id").text("")
        $("#slots").children().children("td").removeAttr("style");
        // render slots color with yellow if there is a wafer
        for (i=0; i<map.length; i++) {
            if (map[i]===1) {
                var slot = "#slot"+(i+1); 
                $(slot).children('label').text(waferid[i]); //waferid
                // $(slot).addClass('full');
                $(slot).parent().addClass('warning');    //bootstrap
            }
        }
    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",

    // Union function
    callBack: function(data) {
        var d = new Date()
        d = d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
        $("code[name='robotmsg']").append(d + ' system log messages: ' + data.Message + "<br>").trigger("change");

        if (data.Cmd === "MAPPING") {
            var index = data.Param.index
            var status = data.Param.status
            var id = data.Param.waferID
            if (index === 0) {
                if (status.length !== 25)
                    alert("Mapping Error, slot count is not correct");
                else {
                    var v = new InputBaseView();
                    v.slotMapping(data.Param);
                    // update mapping info
                    this.getStation().map = status;
                    this.getStation().waferID = id;
                }
            } else {
                var slot = "#slot"+(index);
                if (index < 1 ||  index >50)
                    alert("Mapping Error, slot count is not correct");
                else {
                    if (status === 1) {
                        $(slot).children('label').text(slot);
                        // $(slot).addClass('full');
                        $(slot).parent().addClass('warning');    // bootstrap
                        // update mapping info
                        this.getStation().map[index-1] = status;
                        this.getStation().waferID[index-1] = id;
                    } else {
                        $(slot).children('label').text("");
                        // $(slot).removeClass('full');
                        $(slot).parent().removeClass('warning');    // bootstrap
                        // update mapping info
                        this.getStation().map[index-1] = status;
                        this.getStation().waferID[index-1] = id;
                    }
                }
            }
        } else if (data.Cmd === "ERROR") {}
    },

    openFoupBtnCLick: function (e) {
        this.slotTarget = $(e.currentTarget);
        // clear slots color and text
        $(".wafer-id").text("")
        // $("#slots").children().children("td").removeClass("full");
        $("#slots").children("tr").removeClass("warning");  // bootstrap
        // Build up JSON
        console.log("model:" + this.model.get('viewName'));
        var json = this.encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "OPENFOUP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "openFoup", this.callBack);
    },

    closeFoupBtnCLick: function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "CLOSEFOUP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "closeFoup", this.callBack);
    },

    loadCasetteBtnCLick: function () {
        // clear slots color and text
        $(".wafer-id").text("")
        // $("#slots").children().children("td").removeClass("full");
        $("#slots").children("tr").removeClass("warning");  // bootstrap
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "LOADCASETTE", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "loadCasette", this.callBack);
    },

    unloadCasetteBtnCLick: function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "UNLOADCASETTE", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "unloadCasette", this.callBack);
    },

    openDoorBtnCLick: function () {
        // clear slots color and text
        $(".wafer-id").text("")
        // $("#slots").children().children("td").removeClass("full");
        $("#slots").children("tr").removeClass("warning");  // bootstrap
        $("#slots").children("tr").removeClass("success");  // bootstrap
        $("#slots").children("tr").removeClass("info");  // bootstrap
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", null, "OPENFDOOR", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "openDoor", this.callBack);
    },

    closeDoorBtnCLick: function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", null, "CLOSEDOOR", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "closeDoor", this.callBack);
    },

    restoreDataBtnCLick: function () {
        // clear slots color and text
        $(".wafer-id").text("")
        // $("#slots").children().children("td").removeClass("full");
        $("#slots").children("tr").removeClass("warning");  // bootstrap
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "RESTOREDATA", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "restoreData", this.callBack);
    },

    updateIdBtnCLick: function () {
        // TODO
        var waferIDArray = new Array();
        $(".wafer-id").each(function(){
            if ($(this).text() === "Unavailable") {
                waferIDArray.push("X");
            } else
                waferIDArray.push($(this).text());
        });
        console.log("updateIdBtnCLick. id:" + waferIDArray.toString());
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), "UPDATEID", waferIDArray, null);
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
            var json = this.encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), action, mapparam, null);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "get"+$("#waferType").val(), this.callBack.bind(this));
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
            var json = this.encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), action, mapparam, null);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "put"+$("#waferType").val(), this.callBack.bind(this));
        } else {
            alert("Slot select fail.");
        }
    },

    mapWaferTypeBtnCLick: function () {
        // Build up JSON
        var action = "MAP" + $("#waferType").val();
        var json = this.encodeJSON("SCHD", "COMMAND", this.model.get('viewName'), action, null, null);
        // AJAX POST
        var map = this.ajaxCall(this.ajaxUrl, json, "map"+$("#waferType").val(), this.callBack.bind(this));
    },

    slotClick: function (e) {
        this.slotTarget = $(e.currentTarget);
        if (!this.slotTarget.hasClass('disable')) {
            var selected_slot = this.slotTarget.parent().parent().children();
            if (this.slotTarget.parent().hasClass('info')) {
                this.slotTarget.parent().removeClass('info');
                console.log('inputBase: '+this.model.get('viewName')+', slot: '+ this.slotTarget.attr('id')+' unselected.');
            } else if (this.slotTarget.parent().hasClass('warning')) {
                if (selected_slot.hasClass('success')) {
                    $('tr.success').addClass('warning').removeClass('success')
                } else {
                    selected_slot.removeClass('info');
                }
                this.slotTarget.parent().removeClass('warning').addClass('success');
                console.log('inputBase: '+this.model.get('viewName')+', slot: '+ this.slotTarget.attr('id')+' selected.');
            } else if (this.slotTarget.parent().hasClass('success')) {
                this.slotTarget.parent().removeClass('success').addClass('warning');
                console.log('inputBase: '+this.model.get('viewName')+', slot: '+ this.slotTarget.attr('id')+' unselected.');
            } else {
                if (selected_slot.hasClass('success')) {
                    $('tr.success').addClass('warning').removeClass('success')
                } else {
                    selected_slot.removeClass('info');
                }
                this.slotTarget.parent().addClass('info');
                console.log('inputBase: '+this.model.get('viewName')+', slot: '+ this.slotTarget.attr('id')+' selected.');
            }
        }
    },

    slotIdDblCkick: function(e) {
        var td = $(e.currentTarget);
        if (!td.hasClass('disable')) {
            td.find('.wafer-id').hide();
            td.find('.wafer-id-input').val(td.find('.wafer-id').text());
            td.find('.wafer-id-input').show().focus();
            td.find('.wafer-id-input').select();
        }
    },

    handleWaferIdChange: function(e) {
        var text = $(e.currentTarget);
        text.hide();
        var td = $(e.currentTarget).parent();
        td.find('.wafer-id').text(text.val());
        td.find('.wafer-id').show();
    }
});