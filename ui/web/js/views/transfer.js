// window.TransferView = Backbone.View.extend({
window.TransferView = window.BaseView.extend({
    initialize: function () {
        this.mode = 'split';
        // All inputs casette maping and wafer ID
    },

    events: {
        "click #splitRadio":"handleSplitMode",
        "click #mergeRadio":"handleMergeMode",
        "click #resequenceRadio":"handleResequenceMode",
        // Split
        // "change #srcStation":"splitSrcStationSelect",
        "click #slots tr td:nth-child(7n+2)":"slotClick",   // slot click
        // Merge
        "click #slotsSrc tr > td":"slotClick",              // source slot click
        "click #slotsTarget tr > td":"slotClick",           // target slot click
        //resequence
        "click #go":"goBtnClick"
    },

    render: function () {
        var that = this;
        $(this.el).html(this.template());
        setTimeout(function() {
            that.synchMode();
        }, 1);
    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",

    callBack: function(data) {

    },

    synchMode: function() {
        var splitPanel      = $('#splitPanel'),
            mergePanel      = $('#mergePanel'),
            resequencePanel = $('#resequencePanel');

        if (this.mode === 'split') {
            splitPanel.show();
            mergePanel.hide();
            resequencePanel.hide();
        } else if (this.mode === 'merge') {
            splitPanel.hide();
            mergePanel.show();
            resequencePanel.hide();
        } else {
            splitPanel.hide();
            mergePanel.hide();
            resequencePanel.show();
        }
    },

    handleSplitMode: function() {
        this.mode = 'split';
        this.synchMode(true, false, false);
    },

    handleMergeMode: function() {
        this.mode = 'merge';
        this.synchMode(false, true, false);
    },

    handleResequenceMode: function() {
        this.mode = 'resequence';
        this.synchMode(false, false, true);
    },

    // Split
    // splitSrcStationSelect: function() {
    //     var srcstn = $('#srcStation').val();
    //     console.log("station" + srcstn);
    // },

    splitInfo: function () {
        // bind all data
        // var srcstn = $('#srcStation').val();    // station ID
        var splitInfoArray = new Array();
        $("#slots tr").each(function(){
            if ($(this).hasClass('selected')) {
                var thisSlot = $(this).children('th').text()
                // build up JSON
                var slotInfoJSON = {
                    targetstn : Number($('#targetStationForSlot'+thisSlot).val()),
                    targetslot : Number($('#targetSlotForSlot'+thisSlot).val()),
                    align : $(this).children('td:eq(3)').children().children().is(':checked'),
                    ocr : $(this).children('td:eq(4)').children().children().is(':checked'),
                    flip : $(this).children('td:last').children().children().is(':checked')
                }
                splitInfoArray.push(slotInfoJSON)
            } else {
                splitInfoArray.push(null);
            }
        });
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", "station"+$('#srcStation').val(), "SPLIT", splitInfoArray, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "transfer - split");
    },

    slotMapping: function (map) {
        // has to include station ID to complete mapping
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

    slotClick: function (e) {
        // has to include station ID to complete mapping
        var slotTarget = $(e.currentTarget);
        var selected_slot = slotTarget.parent().parent().children();
        console.log('inputBase: slot:' + slotTarget.attr('id'));
        if (slotTarget.parent().hasClass('selected')) {
            slotTarget.parent().removeClass('selected');
        } else {
            if(this.mode === "merge")
                selected_slot.removeClass('selected');
            slotTarget.parent().addClass('selected');
        }
    },
    // Merge

    // Resequence
    resequence: function() {
        // Build up JSON
        var so = $('input[name=sortOrder]:checked').attr('id').toUpperCase();
        var im = $('#idMask').val();
        var rsStn = $('#reqSrcStation').val()       // type string
        var rtStn = $('#reqTargetStation').val()    // type string
        var reseq = {
            sortorder: so,
            idmask: im,
            srcstation: Number(rsStn),
            targetstation: Number(rtStn)
        }
        var json = encodeJSON("SCHD", "COMMAND", null, "RESEQUENCE", reseq, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "transfer - resequence");
    },

    goBtnClick: function() {
        if (this.mode === 'split') {
            this.splitInfo();
        } else if (this.mode === 'merge') {

        } else if (this.mode ==='resequence') {
            this.resequence()
        } else
            alert('Transfer mode error, please select again.');
    }
});
