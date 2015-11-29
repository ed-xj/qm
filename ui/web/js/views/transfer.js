window.TransferView = Backbone.View.extend({
    initialize: function () {
        this.mode = 'split';
    },

    events: {
        "click #splitRadio":"handleSplitMode",
        "click #mergeRadio":"handleMergeMode",
        "click #resequenceRadio":"handleResequenceMode"
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
    }
});
