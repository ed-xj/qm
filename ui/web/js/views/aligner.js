window.AlignerView = window.BaseView.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
    },

    events : {
        // "change #lang": "changeLang",
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
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"",
                "message":"readIt"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "readIt");
    },
    
    alignWaferBtnCLick:function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"",
                "message":"alignWafer"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "alignWafer");
    },
    
    getWaferBtnCLick:function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"",
                "message":"getWafer"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getWafer");
    },
    
    putWaferBtnCLick:function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"",
                "message":"putWafer"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "putWafer");
    },
    
    getTopBtnCLick:function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"",
                "message":"getTop"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getTop");
    },
    
    putTopFoupBtnCLick:function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"",
                "message":"putTop"
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "putTop");
    }
});