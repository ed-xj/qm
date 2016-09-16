window.DashboardView = window.BaseView.extend({
    initialize:function (moderator) {
        console.log('Initializing Dashboard View');
        this.moderator = moderator;
        this.moderator.on('lang:change', this.onLangChange.bind(this));
        this.moderator.on('sysmsg:msg', this.onSysMsgChange.bind(this));
        this.sysmsg = [];
        this.logmsg = '';
        this.templateParams = {sysmsg: this.logmsg};
        this.rootrecipepath = "../recipe";
    },

    station_id: "dashboard",    // constant variable, for identify station

    events:{
        "click #recipeModal"        :"showRecipeModal",     // modal - show recipe modal
        "click #loadrecipe_btn"     :"loadRecipeBtnClick",  // load recipe buttom
        "click #startrecipe_btn"    :"startRecipeBtnClick", // start recipe buttom
        "click #stoprecipe_btn"     :"stopRecipeBtnClick",  // stop recipe buttom
        "click #home_btn"           :"homeBtnClick",        // home buttom
        "click #recover_btn"        :"recoverBtnClick",     // recover buttom
        "click #speed_slow_btn"     :"slowBtnClick",        // set speed to slow
        "click #speed_medium_btn"   :"mediumBtnClick",      // set speed to medium
        "click #speed_high_btn"     :"highBtnClick",        // set speed to fast
        "change input[name='secs']" :"onlineStatus",        // online status
        "change code[name='sysmsg']":"autoScrollDown",      // auto scroll to bottom
        "click .recipe-name"        :"recipeClick",         // modal - select recipe table
        "click .recipe-done"        :"modalDoneBtnClick",   // modal - done button
        "change #select-recipe"     :"recipeSelect"         // local file select
    },

    onLangChange: function() {
        console.log('DashboardView::onLangChange');
        this.render()
    },

    onSysMsgChange: function() {
        console.log('DashboardView::onSysMsgChange');
        this.sysmsg.push(this.moderator.get("sysMsg"))
    }, 

    subRender: function() {
        if (this.sysmsg.length != 0) {
            var temp
            for (var i = 0; i <= this.sysmsg.length; i++) {
                temp = this.sysmsg.shift()
                this.callBack(temp)
            };
        }
    },

    // genLogMsg: function() {
    //     // System Messages
    //     for (var i=0; i<Math.floor((Math.random() * 1000) + 1); i++) {
    //         var d = new Date()
    //         d = d.getFullYear()+"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+("0"+d.getDate()).slice(-2)+" "+("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2)+":"+("0"+d.getSeconds()).slice(-2)
    //         this.logmsg += ( d + ' >> system log messages ' + i);
    //         this.logmsg += '<br>';
    //     }
    //     this.templateParams = {sysmsg: this.logmsg};
    // },

    activate: function() {

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
        $("code[name='sysmsg']").append(d + arrow + data.Message + "<br>").trigger("change");
    },

    showRecipeModal: function () {
        // Show modal, select recipe
        $("#Modal-recipe").modal({show: true});

        // Windows file select
        // Check for the various File API support.
        // if (window.File && window.FileReader && window.FileList && window.Blob) {
        //   // Great success! All the File APIs are supported.
        //     $("#select-recipe").click()
            
        // } else {
        //     alert('The File APIs are not fully supported in this browser.');
        //     return
        // }
    },

    // Windows file select
    // recipeSelect: function (e) {
    //     var filename = $("#select-recipe")
    //     this.recipepath = filename
    //     filename =  filename.val()
    //     if (filename.substring(3,11) == 'fakepath' )    { 
    //         filename = filename.substring(12); 
    //     }
    //     if ( /\.(rc|txt)$/i.test(filename) ) {
    //         $("#recipeModal").val(filename)
    //         this.readRecipe(e)
    //     } else {
    //         alert("Wrong data type!")
    //         this.recipepath = ""
    //     }
    // },

    loadRecipeBtnClick:function () {
        var recipe = $('#recipeModal').val()
        // update recipe name to systemInfo      
        this.moderator.set("recipename",recipe)
        // read in recipe from SCHD

        // // Build up JSON
        // var json = this.encodeJSON("SCHD", "COMMAND", this.station_id, "LOADRECIPE", recipe, null);
        // // AJAX POST
        // this.ajaxCall(this.ajaxUrl, json, "load recipe", this.callBack);
    },

    refreshDirectory: function (path) {
        var json = this.encodeJSON("APACHE", "GET", this.station_id, "GETDIRECTORY", this.rootrecipepath, "request for recipe directory");
        this.ajaxCall(this.ajaxUrl, json, "list of recipe", this.callBack);
    },

    startRecipeBtnClick:function () {
        // Build up JSON
        var recipe = $('#recipeModal').val()
        var json = this.encodeJSON("SCHD", "COMMAND", this.station_id, "STARTRECIPE", recipe, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "start recipe", this.callBack);
    },

    stopRecipeBtnClick:function () {
        // Build up JSON
        var recipe = $('#recipeModal').val()
        var json = this.encodeJSON("SCHD", "COMMAND", this.station_id, "STOPRECIPE", recipe, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "stop recipe", this.callBack);
    },

    homeBtnClick: function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", this.station_id, "HOME", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "home", this.callBack);
    },

    recoverBtnClick: function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", this.station_id, "RECOVER", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "recover", this.callBack);
    },

    slowBtnClick:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", this.station_id, "SPEEDSLOW", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "slow", this.callBack);
    },

    mediumBtnClick:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", this.station_id, "SPEEDMEDIUM", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "medium", this.callBack);
    },

    highBtnClick:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", this.station_id, "SPEEDHIGH", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "high", this.callBack);
    },

    onlineStatus: function (e) {
        // online status
        if ($("input[name='secs']").parent().hasClass("active")) {
            var status = $(e.currentTarget).attr("value");

            // Build up JSON
            var json = this.encodeJSON("SCHD", "COMMAND", this.station_id, "TOOLSTATUS", status, null);
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