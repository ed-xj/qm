window.RobotView = window.BaseView.extend({

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
        "click #refresh":"refershBtnCLick",     // refresh
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

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",
    
    callBack: function(data) {
        // show message in Message section, and trigger "change" event
        $("code[name='sysmsg']").append(new Date() + ':system log messages ' + data.message + "<br>").trigger("change");
    },

// Button click events
    goBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "GO", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "go", this.callBack);
    },

    showHelpModal: function () {
        var frameSrc = "/ui/help/index.htm#t=Safety%2FDefinitions.htm";
        $("#myIframe").attr("src", frameSrc);
        $("#myModal").modal({show: true});
    },

    refershBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "REFERSH", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "refresh", this.callBack);
    },

    resetf12BtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "RESETF12", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "resetF12", this.callBack);
    },

    gripBtnCLick: function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "GRIP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "grip", this.callBack);
    },

    ungripBtnCLick: function() {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "UNGRIP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "ungrip", this.callBack);
    },

    learnBtnCLick:function () {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "LEARN", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "learn", this.callBack);    
    },

    learnNewBtnCLick: function() {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "LEARN_NEW", null, null);
        //AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "learn_new", this.callBack);
    },

    moveBtnClick:function () {
        // ditinguish if user selected or not
        if ( this.moveAttr.station !== "stn" && this.moveAttr.pose !== "pose" && this.moveAttr.highlow !== "hl" && this.moveAttr.index !== "idx") {
            // console.log("test are "+this.moveAttr.station+this.moveAttr.pose+this.moveAttr.highlow+this.moveAttr.index);

            // linear checkbox
            var linearbox = $("#linearCheckbox").is(':checked');    // TRUE if checked, FALSE if nonchecked

            // Build up JSON
            var json = encodeJSON("SCHD", "COMMAND", null, "MOVE", this.moveAttr, null);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "move", this.callBack);
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
        var json = encodeJSON("SCHD", "COMMAND", null, "PICK", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "pick", this.callBack);
    },

    placeBtnCLick: function() {
        // Build up JSON
        var json = encodeJSON("SCHD", "COMMAND", null, "PLACE", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "place", this.callBack);
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
                // Build up JSON
                var json = encodeJSON("SCHD", "COMMAND", null, command, null, null);
                // AJAX POST
                this.ajaxCall(this.ajaxUrl, json, "robot command", this.callBack);
                console.log("command sent: " + command);
            }
        }
    }
});