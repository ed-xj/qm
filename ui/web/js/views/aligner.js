window.AlignerView = window.BaseView.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
        this.moderator.on('lang:change', this.onLangChange.bind(this));
    },

    events : {
        "click button[for='changeAngle']":"changeAngleBtnClick", // up btn
        "click #readId":"readIdBtnClick",               // read it
        "click #alignWafer":"alignWaferBtnClick",       // align wafer
        "keypress #alignWaferAngle":"InputTextKeyPress",
		"focus #alignWaferAngle":"InputTextFocus",
        "change #alignWaferAngle":"alignWaferAngleChg",
        "input input[name='w-angle']":"alignWaferSliderChg",
        "click #updateId":"updateIDBtnClick",
        "click #getWafer":"getWaferBtnClick",           // get wafer
        "click #putWafer":"putWaferBtnClick",           // put wafer
        "click #getTop":"getTopBtnClick",               // get top
        "click #putTop":"putTopBtnClick",            // put top
		"focus #readIdText":"InputTextFocus",
		"focus #updateIdText":"InputTextFocus",
    },
    
    onLangChange: function() {
        console.log('AlingerView::onLangChange');
        this.render()
    },

    activate: function() {
        this.disableControls(localStorage.userRole);
    },

    render: function () {
        $(this.el).html(this.template());
        this.disableControls(localStorage.userRole);
        return this;
    },

    disableControls: function(role) {
        if (role && role.toLowerCase() === 'operator') {
            $(this.el).find('input, button, table').each(function(index){
                $(this).prop('disabled', true);
                // console.log( index + ": " + $( this ).text() );
            });
//            $(this.el).find('button').each(function(index){
//                $(this).prop('disabled', true);
//                // console.log( index + ": " + $( this ).text() );
//            });
        } else {
            $(this.el).find('input, button, table').each(function(index){
                $(this).prop('disabled', false);
                // console.log( index + ": " + $( this ).text() );
            });
        }
    },

    callback: function(){

    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",

    changeAngleBtnClick: function (e) {
        var val =  parseInt($('#alignWaferAngle').val(), 10);
        if ($(e.currentTarget).children("i").hasClass("fa-caret-up")) {
            if (val < 359)
                this.$('#alignWaferAngle').val( val + 1);
        } else {
            if (val > 0)
                this.$('#alignWaferAngle').val( val - 1);
        }
        $("input[name='w-angle']").val($('#alignWaferAngle').val())
    },
    
    readIdBtnClick:function () {
        var text = $('#readIdText').val()
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", "Aligner", "READID", text, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "readId");
    },
    
    alignWaferBtnClick:function () {
        var alignWaferAngle = $('#alignWaferAngle').val()
        // var alignWaferAngleField = $("#alignWaferAngleField").val();
        console.log(alignWaferAngle)
        if (alignWaferAngle >359 || alignWaferAngle <0) {
            alert("Warning: align angle should be between 0° and 359°")
        } else {
            // Build up JSON
            var json = this.encodeJSON("SCHD", "COMMAND", "Aligner", "ALIGNWAFER", alignWaferAngle, null);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "alignWafer");
        }
    },

    alignWaferAngleChg: function (e) {
		if (Number($(e.currentTarget).val()) > 359) {$(e.currentTarget).val(359)}
        $("input[name='w-angle']").val($(e.currentTarget).val())
    },

    alignWaferSliderChg: function (e) {
        $("#alignWaferAngle").val($(e.currentTarget).val())
    },

    updateIDBtnClick: function() {
        var id = $('#updateIdText').val()
        // console.log(id)
        if (id !== "") {
            // Build up JSON
            var json = this.encodeJSON("SCHD", "COMMAND", "Aligner", "UPDATEID", id, null);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "updateid");
        }
    },
    
    getWaferBtnClick:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", "Aligner", "GETWAFER", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getWafer");
    },
    
    putWaferBtnClick:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", "Aligner", "PUTWAFER", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "putWafer");
    },
    
    getTopBtnClick:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", "Aligner", "GETTOP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getTop");
    },
    
    putTopBtnClick:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", "Aligner", "PUTTOP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "putTop");
    },
	
    InputTextKeyPress: function (e) {
        // enter key
		var key = e.which;
		if ((key<48 || key>57) && key!=13){e.preventDefault();}
    },
	
    InputTextFocus: function (e) {
		$(e.currentTarget).select();
    },
});