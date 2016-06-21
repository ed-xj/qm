window.DashboardView = window.BaseView.extend({

    initialize:function (moderator) {
        console.log('Initializing Dashboard View');
        this.moderator = moderator;
        this.moderator.on('lang:change', this.onLangChange.bind(this));
        this.logmsg = '';
        this.templateParams = {sysmsg: this.logmsg};
        // this.moderator.on('change', _.bind(this.render, this))
        // this.genLogMsg();
//        this.template = _.template(directory.utils.templateLoader.get('home'));
//        this.template = templates['Home'];
    },

    events:{
        "click #recipeModal": "showRecipeModal",       // recipe
        "click #loadrecipe":"loadRecipeBtnClick",      // load recipe
        "click #startrecipe":"startRecipeBtnClick",    // start recipe
        "click #stoprecipe":"stopRecipeBtnClick",      // stop recipe
        "click #home":"homeBtnClick",                   // home
        "click #recover":"recoverBtnClick",             // recover
        "click #slow":"slowBtnClick",       // set speed to slow
        "click #medium":"mediumBtnClick",   // set speed to medium
        "click #high":"highBtnClick",       // set speed to fast
        "change input[name='secs']":"onlineStatus",     // online status
        "change code[name='sysmsg']":"autoScrollDown",  // auto scroll to bottom
        "click .recipe-name":"recipeClick",
        "click .recipe-done":"modalDoneBtnClick"
    },

    onLangChange: function() {
        console.log('DashboardView::onLangChange');
        this.render()
    },

    genLogMsg: function() {
        // System Messages
        for (var i=0; i<Math.floor((Math.random() * 1000) + 1); i++) {
            var d = new Date()
            d = d.getFullYear()+"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+("0"+d.getDate()).slice(-2)+" "+("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2)+":"+("0"+d.getSeconds()).slice(-2)
            this.logmsg += ( d + ' >> system log messages ' + i);
            this.logmsg += '<br>';
        }
       
        this.templateParams = {sysmsg: this.logmsg};
    },

    activate: function() {
        // this.genLogMsg();
        // this.render();
        this.loadsysmsg();
    },

    render:function () {
        this.templateParams = {sysmsg: this.logmsg};
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
        $("code[name='sysmsg']").append(d + arrow + data.Message + "<br>").trigger("change");
    },

    loadsysmsg: function() {
        console.log("system msg loaded")
        var sysmsg = this.moderator.get("sysMsg")
        console.log("sysmsg: "+sysmsg)
        if ( sysmsg.length != 0) {
            for (i=0; i< sysmsg.length; i++) {
                $("code[name='sysmsg']").append(sysmsg[i] + "<br>").trigger("change");
            }
        }
    },

    systemStatus: function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "STATUS", null, "SYSSTATUS", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "status", this.callBack);
    },

    showRecipeModal: function () {
        $("#Modal-recipe").modal({show: true});
    },

    loadRecipeBtnClick:function () {
        //
        // model object for system status and slotmapping
        // console.log(this.moderator.get('sysStatus'))
        // var a = this.moderator.getStation(1)
        // console.log(a.map.toString())
        // a.station = 7
        // this.moderator.set('sysStatus',"running")       // write to systemInfo
        // console.log(this.moderator.get('sysStatus'))    // read from systemInfo
        //

        var recipe = $('#recipeModal').val()
        // update recipe name to systemInfo      
        this.moderator.set("recipe",recipe)

        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", null, "LOADRECIPE", recipe, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "load recipe", this.callBack);
    },

    startRecipeBtnClick:function () {
        // Build up JSON
        var recipe = $('#recipeModal').val()
        var json = this.encodeJSON("SCHD", "COMMAND", null, "STARTRECIPE", recipe, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "start recipe", this.callBack);
    },

    stopRecipeBtnClick:function () {
        // Build up JSON
        var recipe = $('#recipeModal').val()
        var json = this.encodeJSON("SCHD", "COMMAND", null, "STOPRECIPE", recipe, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "stop recipe", this.callBack);
    },

    homeBtnClick: function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", null, "HOME", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "home", this.callBack);
    },

    recoverBtnClick: function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", null, "RECOVER", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "recover", this.callBack);
    },

    slowBtnClick:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", null, "SPEEDSLOW", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "slow", this.callBack);
    },

    mediumBtnClick:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", null, "SPEEDMEDIUM", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "medium", this.callBack);
    },

    highBtnClick:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", null, "SPEEDHIGH", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "high", this.callBack);
    },

    onlineStatus: function (e) {
        // online status
        if ($("input[name='secs']").parent().hasClass("active")) {
            var status = $(e.currentTarget).attr("value");

            // Build up JSON
            var json = this.encodeJSON("SCHD", "COMMAND", null, "TOOLSTATUS", status, null);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "toolstatus", this.callBack);
            console.log("online status changed to "+status);
        }
    },

    autoScrollDown: function (e) {
        // auto scroll down
        var scrollTarget = $(e.currentTarget).parent().parent();
        scrollTarget.scrollTop(scrollTarget.get(0).scrollHeight);
    },

    recipeClick: function (e) {     // single selection
        $(".recipe-name.success").removeClass("success")
        $(e.currentTarget).addClass("success")
    },

    modalDoneBtnClick: function () {
        var r = $(".recipe-name.success > td").text()   
        $("#recipeModal").val(r)                    // show recipe name in input
    }
});