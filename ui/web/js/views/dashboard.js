window.DashboardView = Backbone.View.extend({

    initialize:function (moderator) {
        console.log('Initializing Dashboard View');
        this.moderator = moderator;
        this.moderator.on('lang:change', this.onLangChange);
        this.logmsg = '';
        this.templateParams = {sysmsg: this.logmsg};
        this.genLogMsg();
//        this.template = _.template(directory.utils.templateLoader.get('home'));
//        this.template = templates['Home'];
    },

    events:{
        // "click #showMeBtn":"showMeBtnClick",
        "click #load_recipe":"loadRecipeBtnClick",      // load recipe
        "click #start_recipe":"startRecipeBtnClick",    // start recipe
        "click #stop_recipe":"stopRecipeBtnClick",      // stop recipe
        "click #home":"homeBtnClick",                   // home
        "click #recover":"recoverBtnClick",             // recover
        "change input[name='secs']":"onlineStatus",     // online status
        "change code[name='sysmsg']":"autoScrollDown",  // auto scroll to bottom
    },

    onLangChange: function() {
        console.log('DashboardView::onLangChange');
    },

    genLogMsg: function() {
        // System Messages
        for (var i=0; i<Math.floor((Math.random() * 1000) + 1); i++) {
            this.logmsg += ((new Date()) + ':system log messages ' + i);
            this.logmsg += '<br>';
        }
       
        this.templateParams = {sysmsg: this.logmsg};
    },

    activate: function() {
        this.genLogMsg();
        this.render();
    },

    render:function () {
        this.templateParams = {sysmsg: this.logmsg};
        $(this.el).html(this.template(this.templateParams));
        return this;
    },

    // showMeBtnClick:function () {
    //     app.headerView.search();
    // },

    // AJAX POST
    ajaxCall: function(json, msg) {
        $.ajax({
            url: "/cgi-bin/tcp_socket_client.js",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(json),
            datatype: "json",
            success: function(data) {
                console.log("AJAX POST Sucess(" + msg + ")");
                console.log(data.message);
                // show message in Message section, and trigger "change" event
                $("code[name='sysmsg']").append(new Date() + ' system log messages: ' + data.message + "<br>").trigger("change");
            },
            error: function(error) {
                console.log("Some error in fetching the notification");
            }
        });
    },

    loadRecipeBtnClick:function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"",
                "message":"load_recipe"
            };
        // AJAX POST
        this.ajaxCall(json, "load recipe");
    },

    startRecipeBtnClick:function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"",
                "message":"start_recipe"
            };
        // AJAX POST
        this.ajaxCall(json, "start recipe");
    },

    stopRecipeBtnClick:function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"",
                "message":"stop_recipe"
            };
        // AJAX POST
        this.ajaxCall(json, "stop recipe");
    },

    homeBtnClick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"",
                "message":"home"
            };
        // AJAX POST
        this.ajaxCall(json, "home");
    },

    recoverBtnClick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"",
                "message":"recover"
            };
        // AJAX POST
        this.ajaxCall(json, "recover");
    },

    onlineStatus: function () {
        // online status
        var status = $("input[name='secs']:checked").attr("value");
        console.log("online status changed to "+status)
    },

    autoScrollDown: function (e) {
        // auto scroll down
        var scrollTarget = $(e.currentTarget).parent().parent();
        scrollTarget.scrollTop(scrollTarget.get(0).scrollHeight); 
    },
});