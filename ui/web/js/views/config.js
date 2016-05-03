window.ConfigView = window.BaseView.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
    },

    events : {
        "change #syslog":"syslogLevel",     // system log level
        "change #robotlog":"robotlogLevel", // robot log level
        "change #lang":"changeLang",        // change language
        // add secs/gem event
        "click #secsBtn":"secsBtnClick",
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
    
    syslogLevel:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", null, "SYSLOGLEVEL", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "syslogLevel");
        console.log("syslogLevel changed " + $('#syslog').val());
        this.moderator.trigger('syslog:change');
    },

    robotlogLevel:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", null, "ROBOTLOGLEVEL", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "robotloglevel");
        console.log("robotlogLevel changed " + $('#robotlog').val());
        this.moderator.trigger('robotlog:change');
    },

    secsBtnClick: function (e) {
        var secsCmd = ""
        var tmp_cmd = $(e.currentTarget).attr("name")
        switch ($(e.currentTarget).attr("name")) {
            case "connect":
                secsCmd = "CONNECT"
                break;
            case "disconnect":
                secsCmd = "DISCONNECT"
                break;
            case "sc3":
                secsCmd = tmp_cmd
                break;
            case "sc4":
                secsCmd = tmp_cmd
                break;
            case "sc5":
                secsCmd = tmp_cmd
                break;
        }
        var msg = "SECS/GEM cmd " + secsCmd
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", "SECS/GEM", secsCmd, null, msg);
        //AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "secsCmd", this.callBack);
    }
});