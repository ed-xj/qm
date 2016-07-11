window.LoadportView = window.BaseView.extend({

    initialize: function (moderator) {
        this.moderator = moderator;
        this.moderator.on('lang:change', this.onLangChange.bind(this));
        this.logmsg = '';
        this.templateParams = {robotmsg: this.logmsg};
        // this.genLogMsg();
        this.moveAttr = {
            station:'stn',
            pose:'pose',
            highlow:'high',
            // linear:null,
            index:'idx'
        };
//        this.template = _.template(directory.utils.templateLoader.get('home'));
//        this.template = templates['Home'];
    },

    events:{
        "click #go_btn":"goBtnClick",           // go
        // "click #robotHelpModal": "showHelpModal",// help
        "click #refresh":"refershBtnClick",     // refresh
        "click #reset_f_12":"resetf12BtnClick", // resetF12
        "click #grip":"gripBtnClick",           // grip
        "click #ungrip":"ungripBtnClick",       // ungrip
        "click #learn":"learnBtnClick",         // learn
        "click #learn_new":"learnNewBtnClick",  // learn new
        "click #move":"moveBtnClick",           // move
        "contextmenu #move":"moveBtnRightClick",// move (right click)
        "click .dropdown-menu[aria-labelledby='stationMenu'] li a":"stationMenuClick",// station select
        "click .dropdown-menu[aria-labelledby='poseMenu'] li a":"poseMenuClick",      // pose select
        "click .dropdown-menu[aria-labelledby='highlowMenu'] li a":"highlowMenuClick",// high-low select
        "click .dropdown-menu[aria-labelledby='indexMenu'] li a":"indexMenuClick",    // index select
        "click #pick":"pickBtnClick",           // pick
        "click #place":"placeBtnClick",         // place
        "click #robotCmd":"robotCmdBtnClick",
        "change code[name='robotmsg']":"autoScrollDown",// auto scroll to bottom
        "keypress #cmd":"robotCommandEnter"     // robot command
    },

    genLogMsg: function() {
        for (var i=0; i<Math.floor((Math.random() * 1000) + 1); i++) {
            this.logmsg += ((new Date()) + ':system log messages ' + i);
            this.logmsg += '<br>';
        }
        this.templateParams = {robotmsg: this.logmsg};
    },

    activate: function() {
        // this.genLogMsg();
        // this.render();
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
        this.templateParams = {robotmsg: this.logmsg};
        $(this.el).html(this.template(this.templateParams));
        this.disableControls(localStorage.userRole);
        return this;
    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",
    
    callBack: function(data) {
        // show message in Message section, and trigger "change" event
        var arrow = " >> "
        if (data.CmdDest === "UI") {
            arrow = " << "
        }
        var d = new Date()
        d = d.getFullYear()+"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+("0"+d.getDate()).slice(-2)+" "+("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2)+":"+("0"+d.getSeconds()).slice(-2)
        $("code[name='robotmsg']").append(d + arrow + data.Message + "<br>").trigger("change");
    },

    // motion ( move, pick, place )
    motionFunc: function(data) {
        // ditinguish if user selected or not
        if ( this.moveAttr.station !== "stn" && this.moveAttr.pose !== "pose") {
            // console.log("test are "+this.moveAttr.station+this.moveAttr.pose+this.moveAttr.highlow+this.moveAttr.index);

            // linear checkbox
            // this.moveAttr.linear = $("#linearCheckbox").is(':checked');    // TRUE if checked, FALSE if nonchecked

            // Build up JSON
            var json = this.encodeJSON("SCHD", "COMMAND", this.moveAttr.station, data.toUpperCase(), this.moveAttr, "Command "+data);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, data, this.callBack);
        } else {
            alert("Please select correct staion, pose or index");
        }
    },

// Button click events
    goBtnClick: function () {
        var command = $('#cmd').val();
        if (command === "") {
            command = "\n"
        } 
        // else {
            this.callBack({Message:command})
            // Build up JSON
            var json = this.encodeJSON("SCHD", "COMMAND", null, "GO", command, null);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "go", this.callBack);
            console.log("command sent: " + command);
            $('#cmd').val("")
        // }
    },

    showHelpModal: function () {
        var frameSrc = "/ui/help/index.htm#t=Safety%2FDefinitions.htm";
        $("#myIframe").attr("src", frameSrc);
        $("#myModal").modal({show: true});
    },

    refershBtnClick: function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", null, "REFERSH", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "refresh", this.callBack);
    },

    resetf12BtnClick: function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", null, "RESETF12", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "resetF12", this.callBack);
    },

    gripBtnClick: function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", null, "GRIP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "grip", this.callBack);
    },

    ungripBtnClick: function() {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", null, "UNGRIP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "ungrip", this.callBack);
    },

    learnBtnClick:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", null, "LEARN", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "learn", this.callBack);    
    },

    learnNewBtnClick: function() {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", null, "LEARN_NEW", null, null);
        //AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "learn_new", this.callBack);
    },

    moveBtnClick:function () {
        this.motionFunc("move");
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

    pickBtnClick: function() {
        if (this.moveAttr.index !== "idx") {
            // Build up JSON
            var json = this.encodeJSON("SCHD", "COMMAND", null, "PICK", null, null);
            //AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "pick", this.callBack);
            // this.motionFunc("pick");
        } else {
            alert("Please select correct staion, pose, high-low, linear or index");
        }
    },

    placeBtnClick: function() {
        if (this.moveAttr.index !== "idx") {
            // Build up JSON
            var json = this.encodeJSON("SCHD", "COMMAND", null, "PLACE", null, null);
            //AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "place", this.callBack);
            // this.motionFunc("place");
        } else {
            alert("Please select correct staion, pose, high-low, linear or index");
        }
    },

    robotCmdBtnClick: function (e) {
        var robotCmd = ""
        var tmp_cmd = $(e.currentTarget).attr("name")
        var value = $(e.currentTarget).val()
        switch (tmp_cmd) {
            case "rc1":
                robotCmd = value
                break;
            case "rc2":
                robotCmd = value
                break;
            case "rc3":
                robotCmd = value
                break;
            case "rc4":
                robotCmd = value
                break;
            case "rc5":
                robotCmd = value
                break;
        }
        var msg = "robot cmd " + robotCmd
        this.callBack({Message:robotCmd})   // Robot cmd msg
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", "ROBOT", robotCmd, null, msg);
        //AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "robotCmd", this.callBack);
    },

    autoScrollDown: function (e) {
        // auto scroll down
        var scrollTarget = $(e.currentTarget).parent().parent();
        scrollTarget.scrollTop(scrollTarget.get(0).scrollHeight); 
    },

    robotCommandEnter: function (e) {
        // enter key
        if(e.which === 13) {
            this.goBtnClick();
        }
    }
});