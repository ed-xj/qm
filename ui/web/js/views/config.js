window.ConfigView = window.BaseView.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
        this.logmsg = "";
        this.templateParams = {secsgemmsg: this.logmsg};
    },

    events : {
        "change #syslog":"syslogLevel",     // system log level
        "change #robotlog":"robotlogLevel", // robot log level
        "change #lang":"changeLang",        // change language
        // add secs/gem event
        "click #secsBtn":"secsBtnClick",
        "change code[name='secsgemmsg']":"autoScrollDown",// auto scroll to bottom
        "keypress #cmd":"secsgenCommandEnter",     // secs/gem command
        "click #send_btn":"sendBtnClick"
    },

    changeLang: function(event) {
        window.currentLang = event.target.value;
        this.moderator.trigger('lang:change');
        this.render();
    },

    activate: function() {
        // this.render();
    },

    render:function () {
        $(this.el).html(this.template(this.templateParams));
        return this;
    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",

    callBack: function(data) {
        // if (data.CmdType === "ERROR") {
        //     alert(data.Message);
        // }
        var arrow = " >> "
        if (data.CmdDest === "UI") {
            arrow = " << "
        }
        // show message in Message section, and trigger "change" event
        var d = new Date()
        d = d.getFullYear()+"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+("0"+d.getDate()).slice(-2)+" "+("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2)+":"+("0"+d.getSeconds()).slice(-2)
        $("code[name='secsgemmsg']").append(d + arrow + data.Message + "<br>").trigger("change");
    },
    
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
            case "sc1":
                secsCmd = "CONNECT"
                break;
            case "sc2":
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
        var msg = "SECS/GEM : " + secsCmd
        this.callBack({Message:msg})
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", "SECS/GEM", secsCmd, null, msg);
        //AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "secsCmd", this.callBack);
    },

    autoScrollDown: function (e) {
        // auto scroll down
        var scrollTarget = $(e.currentTarget).parent().parent();
        scrollTarget.scrollTop(scrollTarget.get(0).scrollHeight);
    },

    secsgenCommandEnter: function (e) {
        // enter key
        if(e.which === 13) {
            this.sendBtnClick();
        }
    },

    // Button click events
    sendBtnClick: function () {
        var command = $('#cmd').val();
        if (command === "") {
            command = "\n"
        } 
        // else {
            this.callBack({Message:command})
            // Build up JSON
            var json = this.encodeJSON("SCHD", "COMMAND", "SECS/GEM", command, null, "secs/gem cmd: "+command);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "secsCmd", this.callBack);
            console.log("command sent: " + command);
            $('#cmd').val("")
        // }
    }
});