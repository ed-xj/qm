window.AlignerView = window.BaseView.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
        this.moderator.on('lang:change', this.onLangChange.bind(this));
    },

    events : {
        "click #readId":"readIdBtnClick",               // read it
        "click #alignWafer":"alignWaferBtnClick",       // align wafer
        "change #alignWaferId":"alignWaferIdChg",
        "input input[name='w-angle']":"alignWaferSliderChg",
        "click #updateId":"updateIDBtnClick",
        "click #getWafer":"getWaferBtnClick",           // get wafer
        "click #putWafer":"putWaferBtnClick",           // put wafer
        "click #getTop":"getTopBtnClick",               // get top
        "click #putTop":"putTopBtnClick"            // put top
    },
    
    onLangChange: function() {
        console.log('AlingerView::onLangChange');
        this.render()
    },

    render: function () {
        var callback = function(){
            // Solution 1
            // this.$('.spinner span .btn:first-of-type').on('click', function() {
            //     var val =  parseInt(this.$('.spinner input').val(), 10);
            //     if (val < 359)
            //         this.$('.spinner input').val( val + 1);
            // }.bind(this));
            // this.$('.spinner span .btn:last-of-type').on('click', function() {
            //     var val =  parseInt(this.$('.spinner input').val(), 10);
            //     if (val > 1)
            //         this.$('.spinner input').val( val - 1);
            // }.bind(this));}.bind(this);

            // Solution 2
            this.$('.fa-caret-up').parent('button').on('click', function() {
                var val =  parseInt(this.$('#alignWaferId').val(), 10);
                if (val < 359)
                    this.$('#alignWaferId').val( val + 1);
                $("input[name='w-angle']").val(this.$('#alignWaferId').val())
            }.bind(this));
            this.$('.fa-caret-down').parent('button').on('click', function() {
                var val =  parseInt(this.$('#alignWaferId').val(), 10);
                if (val > 0)
                    this.$('#alignWaferId').val( val - 1);
                $("input[name='w-angle']").val(this.$('#alignWaferId').val())
            }.bind(this));}.bind(this);

        $(this.el).html(this.template());
        setTimeout(callback, 1);
        return this;
    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",
    
    readIdBtnClick:function () {
        var text = $('#readIdText').val()
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", "Aligner", "READID", text, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "readId");
    },
    
    alignWaferBtnClick:function () {
        var alignWaferId = $('#alignWaferId').val()
        // var alignWaferIdField = $("#alignWaferIdField").val();
        console.log(alignWaferId)
        if (alignWaferId >359 || alignWaferId <0) {
            alert("Warning: align angle should be between 0° and 359°")
        } else {
            // Build up JSON
            var json = this.encodeJSON("SCHD", "COMMAND", "Aligner", "ALIGNWAFER", alignWaferId, null);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "alignWafer");
        }
    },

    alignWaferIdChg: function (e) {
        $("input[name='w-angle']").val($(e.currentTarget).val())
    },

    alignWaferSliderChg: function (e) {
        $("#alignWaferId").val($(e.currentTarget).val())
    },

    updateIDBtnClick: function() {
        var id = $('#updateIdText').val()
        // console.log(id)
        if (id !== "") {
            // Build up JSON
            var json = this.encodeJSON("SCHD", "COMMAND", "Aligner", "UPDATEID", id, null);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "updateid");
        }
    },
    
    getWaferBtnClick:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", "Aligner", "GETWAFER", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getWafer");
    },
    
    putWaferBtnClick:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", "Aligner", "PUTWAFER", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "putWafer");
    },
    
    getTopBtnClick:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", "Aligner", "GETTOP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getTop");
    },
    
    putTopBtnClick:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", "Aligner", "PUTTOP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "putTop");
    }
});