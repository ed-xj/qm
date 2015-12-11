window.TransferView = Backbone.View.extend({
    initialize: function () {
        this.mode = 'split';
        // All inputs casette maping and wafer ID
    },

    events: {
        "click #splitRadio":"handleSplitMode",
        "click #mergeRadio":"handleMergeMode",
        "click #resequenceRadio":"handleResequenceMode",
        // Split
        "click #slots tr td:nth-child(7n+2)":"slotClick",   // slot click
        // Merge
        "click #slotsSrc tr > td":"slotClick",              // source slot click
        "click #slotsTarget tr > td":"slotClick"            // target slot click
    },

    render: function () {
        var that = this;
        $(this.el).html(this.template());
        setTimeout(function() {
            that.synchMode();
        }, 1);
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
            selected_slot.removeClass('selected');
            slotTarget.parent().addClass('selected');
        }
    }
    // Merge

    // Resequence
    // id="sortASC" / id="sortDEC"
    // testfield id="idMask"
    // source station (select id="reqSrcStation" option 1-8)
    // target station (select id="reqSrcStation" option 1-8)
});
