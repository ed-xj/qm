window.AlignerView = window.BaseView.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
    },

    events : {
        "click #readIt":"readItBtnCLick",               // read it
        "click #alignWafer":"alignWaferBtnCLick",       // align wafer
        "click #getWafer":"getWaferBtnCLick",           // get wafer
        "click #putWafer":"putWaferBtnCLick",           // put wafer
        "click #getTop":"getTopBtnCLick",               // get top
        "click #putTop":"putTopFoupBtnCLick"            // put top
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",
    
    readItBtnCLick:function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "READIT", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "readIt");
    },
    
    alignWaferBtnCLick:function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "ALIGNWAFER", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "alignWafer");
    },
    
    getWaferBtnCLick:function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "GETWAFER", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getWafer");
    },
    
    putWaferBtnCLick:function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "PUTWAFER", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "putWafer");
    },
    
    getTopBtnCLick:function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "GETTOP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getTop");
    },
    
    putTopFoupBtnCLick:function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "PUTTOP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "putTop");
    }
});