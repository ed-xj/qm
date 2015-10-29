window.RobotView = Backbone.View.extend({

    initialize: function (moderator) {
        console.log('Initializing Robot View');
        this.moderator = moderator;
        this.moderator.on('lang:change', this.onLangChange.bind(this));
        this.logmsg = '';
        this.templateParams = {sysmsg: this.logmsg};
        this.genLogMsg();
        this.moveAttr = {
            station:'stn',
            pose:'pose',
            highlow:'hl',
            index:'idx'
        };
//        this.template = _.template(directory.utils.templateLoader.get('home'));
//        this.template = templates['Home'];
    },

    events:{
        //"click #showMeBtn":"showMeBtnClick",
        "click #go_btn":"goBtnCLick",           // go
        "click #robotHelpModal": "showHelpModal",// help
        "click #refersh":"refershBtnCLick",     // refersh
        "click #reset_f_12":"resetf12BtnCLick", // resetF12
        "click #grip":"gripBtnCLick",           // grip
        "click #ungrip":"ungripBtnCLick",       // ungrip
        "click #learn":"learnBtnCLick",         // learn
        "click #learn_new":"learnNewBtnCLick",  // learn new
        "click #move":"moveBtnClick",           // move
        "contextmenu #move":"moveBtnRightClick",// move (right click)
        "click .dropdown-menu[aria-labelledby='stationMenu'] li a":"stationMenuClick",// station select
        "click .dropdown-menu[aria-labelledby='poseMenu'] li a":"poseMenuClick",      // pose select
        "click .dropdown-menu[aria-labelledby='highlowMenu'] li a":"highlowMenuClick",// high-low select
        "click .dropdown-menu[aria-labelledby='indexMenu'] li a":"indexMenuClick",    // index select
        "click #pick":"pickBtnCLick",           // pick
        "click #place":"placeBtnCLick",         // place
        "change code[name='sysmsg']":"autoScrollDown",// auto scroll to bottom
        "keypress #cmd":"robotCommandEnter"     // robot command
    },

    genLogMsg: function() {
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

    onLangChange: function() {
        console.log('RobotView::onLangChange');
        this.render();
    },

    disableControls: function(role) {
        if (role && role.toLowerCase() === 'operator') {
            $(this.el).find('input, button').each(function(index){
                $(this).prop('disabled', true);
                // console.log( index + ": " + $( this ).text() );
            });
//            $(this.el).find('button').each(function(index){
//                $(this).prop('disabled', true);
//                // console.log( index + ": " + $( this ).text() );
//            });
        }
    },

    render: function () {
        this.templateParams = {sysmsg: this.logmsg};
        $(this.el).html(this.template(this.templateParams));
        this.disableControls(localStorage.userRole);
        return this;
    },

    // showMeBtnClick:function () {
    //     app.headerView.search();
    // },

    ajaxCall: function(json, msg) {
    // ajaxCall: function(json, msg, callback) {
        $.ajax({
            url: "/cgi-bin/tcp_socket_client.js",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(json),
            datatype: "json",
            success: function(data) {
                console.log("AJAX POST Sucess(" + msg + ")");
                console.log(data.message);
                // callback(data);
                // show message in Message section, and trigger "change" event
                $("code[name='sysmsg']").append(new Date() + ' system log messages: ' + data.message + "<br>").trigger("change");

            },
            error: function(error) {
                console.log("Some error in fetching the notification");
            }
        });
    },

// Button click events
    goBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"GO"
            };
        // AJAX POST
        this.ajaxCall(json, "go");
        // callback function
        // this.ajaxCall(json, "go", function(data){
        // });
    },

    showHelpModal: function () {
    var frameSrc = "/ui/help/index.htm#t=Safety%2FDefinitions.htm";
    $("#myIframe").attr("src", frameSrc);
    $("#myModal").modal({show: true});
    },

    refershBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"REFERSH"
            };
        // AJAX POST
        this.ajaxCall(json, "refersh");
    },

    resetf12BtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"RESET F12"
            };
        // AJAX POST
        this.ajaxCall(json, "resetF12");
    },

    gripBtnCLick: function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"GRIP"
            };
        // AJAX POST
        this.ajaxCall(json, "grip");
    },

    ungripBtnCLick: function() {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"UNGRIP"
            };
        // AJAX POST
        this.ajaxCall(json, "ungrip");
    },

    learnBtnCLick:function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"LEARN"
            };
        // AJAX POST
        this.ajaxCall(json, "learn");        
    },

    learnNewBtnCLick: function() {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"LEARN NEW"
            };
        //AJAX POST
        this.ajaxCall(json, "learn_new");
    },

    moveBtnClick:function () {
        // ditinguish if user selected or not
        if ( this.moveAttr.station !== "stn" && this.moveAttr.pose !== "pose" && this.moveAttr.highlow !== "hl" && this.moveAttr.index !== "idx") {
            // console.log("test are "+this.moveAttr.station+this.moveAttr.pose+this.moveAttr.highlow+this.moveAttr.index);

            // linear checkbox
            var linearbox = $("#linearCheckbox").is(':checked');    // TRUE if checked, FALSE if nonchecked

            // Build up JSON
            var json = {
                    "CmdDest":"SCHD",
                    "CmdType":"MOVE"
                };
            // AJAX POST
            this.ajaxCall(json, "move");
        } else {
            alert("Please select correct staion, pose, high-low or index");
        }
    },

    moveBtnRightClick: function (event) {
        // clear default context menu
        event.preventDefault();
        alert('Right button clicked. Help MENU.');
        // window.open();
    },

    stationMenuClick: function (e) {
        // station select
        $('#stationMenu').html($(e.currentTarget).html()+'&nbsp;<span class="caret"></span>');
        this.moveAttr.station = $(e.currentTarget).attr("value");
    },

    poseMenuClick: function (e) {
        // pose select
        $("#poseMenu").html($(e.currentTarget).html()+'&nbsp;<span class="caret"></span>');
        this.moveAttr.pose = $(e.currentTarget).attr("value");
    },

    highlowMenuClick: function (e) {
        // high-low select
        $("#highlowMenu").html($(e.currentTarget).html()+'&nbsp;<span class="caret"></span>');
        this.moveAttr.highlow = $(e.currentTarget).attr("value");
    },

    indexMenuClick: function (e) {
        // pose select
        $("#indexMenu").html($(e.currentTarget).html()+'&nbsp;<span class="caret"></span>');
        this.moveAttr.index = $(e.currentTarget).attr("value");
    },

    pickBtnCLick: function() {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"PICK"
            };
        // AJAX POST
        this.ajaxCall(json, "pick");
    },

    placeBtnCLick: function() {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"PLACE"
            };
        // AJAX POST
        this.ajaxCall(json, "place");
    },

    autoScrollDown: function (e) {
        // auto scroll down
        var scrollTarget = $(e.currentTarget).parent().parent();
        scrollTarget.scrollTop(scrollTarget.get(0).scrollHeight); 
    },

    robotCommandEnter: function (e) {
        // enter key
        if(e.which === 13) {
            // Get text value
            var command = $('#cmd').val();
            if (command === "") {
                alert("Please in put command.");
            } else {
                console.log("command sent: " + command);
                // Build up JSON
                var json = {
                    "CmdDest":"SCHD",
                    "CmdType":"CMD",
                    "message":command
                };
                // AJAX POST
                this.ajaxCall(json, "robot command");
            }
        }
    }
});