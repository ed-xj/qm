window.ConfigView = window.BaseView.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
    },

    events : {
        "click #slow":"slowBtnClick",       // set speed to slow
        "click #medium":"mediumBtnClick",   // set speed to medium
        "click #high":"highBtnClick",       // set speed to fast
        "change #syslog":"syslogLevel",     // system log level (not ready)
        "change #robotlog":"robotlogLevel", // robot log level (not ready)
        "change #lang":"changeLang",        // change language
    },

    changeLang: function(event) {
        window.currentLang = event.target.value;
        this.moderator.trigger('lang:change');
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",
    
    slowBtnClick:function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "SPEEDSLOW", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "slow");
    },

    mediumBtnClick:function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "SPEEDMEDIUM", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "medium");
    },

    highBtnClick:function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "SPEEDHIGH", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "high");
    },

    syslogLevel:function () {

        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "SPEEDHIGH", null, null);
        // AJAX POST
        // this.ajaxCall(json, "fast");
        console.log("syslogLevel changed " + ($('#syslog').val()));
    },

    robotlogLevel:function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "SPEEDHIGH", null, null);
        // AJAX POST
        // this.ajaxCall(json, "fast");
        console.log("robotlogLevel changed");
    }
});
