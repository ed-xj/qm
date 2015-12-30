window.DashboardView = window.BaseView.extend({

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
        "click #loadrecipe":"loadRecipeBtnClick",      // load recipe
        "click #startrecipe":"startRecipeBtnClick",    // start recipe
        "click #stoprecipe":"stopRecipeBtnClick",      // stop recipe
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

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",
    
    callBack: function(data) {
        // show message in Message section, and trigger "change" event
        $("code[name='sysmsg']").append(new Date() + ' system log messages: ' + data.Message + "<br>").trigger("change");
    },

    systemStatus: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "STATUS", null, "SYSSTATUS", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "status", this.callBack);
    },

    loadRecipeBtnClick:function () {
        //
        // model object for system status and slotmapping
        console.log(this.moderator.get('sysStatus'))
        var a = this.moderator.getStation(1)
        console.log(a.map.toString())
        a.station = 7
        this.moderator.set('sysStatus',"running")
        console.log(this.moderator.get('sysStatus'))
        //

        var recipe = $('#recipe').val()
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "LOADRECIPE", recipe, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "load recipe", this.callBack);
    },

    startRecipeBtnClick:function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "STARTRECIPE", null/*recipe*/, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "start recipe", this.callBack);
    },

    stopRecipeBtnClick:function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "STOPRECIPE", null/*recipe*/, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "stop recipe", this.callBack);
    },

    homeBtnClick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "HOME", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "home", this.callBack);
    },

    recoverBtnClick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "RECOVER", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "recover", this.callBack);
    },

    onlineStatus: function () {
        // online status
        var status = $("input[name='secs']:checked").attr("value");
        console.log("online status changed to "+status);
    },

    autoScrollDown: function (e) {
        // auto scroll down
        var scrollTarget = $(e.currentTarget).parent().parent();
        scrollTarget.scrollTop(scrollTarget.get(0).scrollHeight);
    }
});