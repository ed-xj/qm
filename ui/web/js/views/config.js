window.ConfigView = Backbone.View.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
    },

    events : {
        "click #slow":"slowBtnClick",       // set speed to slow
        "click #medium":"mediumBtnClick",   // set speed to medium
        "click #fast":"fastBtnClick",       // set speed to fast
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

    ajaxCall: function(json, msg) {
        $.ajax({
            url: "/node/socket/tcp_example_JSON_client.js",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(json),
            datatype: "json",
            success: function(data) {
                console.log("AJAX POST Sucess(" + msg + ")");
                console.log(data.message);
                // show message in Message section, and trigger "change" event
                // $("code[name='sysmsg']").append(new Date() + ' system log messages: ' + data.message + "<br>").trigger("change");     
            },
            error: function(error) {
                console.log("Some error in fetching the notification");
            }
        });
    },

    slowBtnClick:function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"",
                "message":"speed slow"
            };
        // AJAX POST
        this.ajaxCall(json, "slow");
    },

    mediumBtnClick:function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"",
                "message":"speed medium"
            };
        // AJAX POST
        this.ajaxCall(json, "medium");
    },

    fastBtnClick:function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"",
                "message":"speed fast"
            };
        // AJAX POST
        this.ajaxCall(json, "fast");
    },

    syslogLevel:function () {
        // // Build up JSON
        // var json = {
        //         "CmdDest":"SCHD",
        //         "CmdType":"",
        //         "message":"load_recipe"
        //     };
        // // AJAX POST
        // this.ajaxCall(json, "fast");
    },

    robotlogLevel:function () {
        // // Build up JSON
        // var json = {
        //         "CmdDest":"SCHD",
        //         "CmdType":"",
        //         "message":"load_recipe"
        //     };
        // // AJAX POST
        // this.ajaxCall(json, "fast");
    }
});
