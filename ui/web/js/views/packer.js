window.PackerView = window.BaseView.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
        this.moderator.on('lang:change', this.onLangChange.bind(this));
    },

    events : {
        "change #txt_SLOT_COUNT":"SlotCountTextHander",
        "keypress #txt_SLOT_COUNT":"InputTextKeyPress",
		"focus #txt_SLOT_COUNT":"InputTextFocus",
        "change #txt_WAFER_COUNT":"WaferCountTextHander",
        "keypress #txt_WAFER_COUNT":"InputTextKeyPress",
		"focus #txt_WAFER_COUNT":"InputTextFocus",
        "click #btn_CONFIRM":"ConfirmButtonHandler",
        "change input[name='rng_SLOT_COUNT']":"SlotCountRangeHander",
        "click #btn_SLOT_COUNT_DOWN":"SlotCountDownButtonHandler",
        "click #btn_SLOT_COUNT_TOP":"SlotCountTopButtonHandler",
        "click #btn_GET_WAFER":"GetWaferButtonHandler",					// get top
        "click #btn_PUT_WAFER":"PutWaferButtonHandler",					// put top
    },
    
    onLangChange: function() {
        console.log('PackerView::onLangChange');
        this.render()
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    },

    callback: function () {
		
    },
	
    ajaxUrl: "/cgi-bin/tcp_socket_client.js",

    SlotCountDownButtonHandler: function (e) {
		var val =  parseInt(this.$('#txt_SLOT_COUNT').val(), 10);
		if (val > 1) this.$('#txt_SLOT_COUNT').val( val - 1);
		$("input[name='rng_SLOT_COUNT']").val(this.$('#txt_SLOT_COUNT').val())
		if ($('#txt_WAFER_COUNT').val() >= $('#txt_SLOT_COUNT').val()){$('#txt_WAFER_COUNT').val($('#txt_SLOT_COUNT').val() - 1)}
    },

    SlotCountTopButtonHandler: function (e) {
		var val =  parseInt(this.$('#txt_SLOT_COUNT').val(), 10);
		if (val < 50) this.$('#txt_SLOT_COUNT').val( val + 1);
		$("input[name='rng_SLOT_COUNT']").val(this.$('#txt_SLOT_COUNT').val())
    },

    SlotCountTextHander: function (e) {
		if ($(e.currentTarget).val() > 50){$(e.currentTarget).val(50)}
		if ($(e.currentTarget).val() < 1){$(e.currentTarget).val(1)}
        $("input[name='rng_SLOT_COUNT']").val($(e.currentTarget).val())
		if ($('#txt_WAFER_COUNT').val() >= $(e.currentTarget).val()){$('#txt_WAFER_COUNT').val($(e.currentTarget).val())}
    },

    WaferCountTextHander: function (e) {
		var x = Number($(e.currentTarget).val());
		var y = Number($("#txt_SLOT_COUNT").val());
		if (x > y)
		{
			$(e.currentTarget).val(y);
		}
    },

    SlotCountRangeHander: function (e) {
        $("#txt_SLOT_COUNT").val($(e.currentTarget).val())
		if ($('#txt_WAFER_COUNT').val() >= $("#txt_SLOT_COUNT").val()){$('#txt_WAFER_COUNT').val($("#txt_SLOT_COUNT").val())}
    },
    
    ConfirmButtonHandler:function () {
		var key;
		var x = parseInt($('#txt_SLOT_COUNT').val(), 10);
		var y = parseInt($('#txt_WAFER_COUNT').val(), 10);
		for (var i=1; i <= 50; i++)
		{
			key = ((i <= x) ? 'table-row' : 'none');
			$('#slot'+i).parent().css("display",key);
			if(i <= y) {$('#slot'+i).addClass('warning');}
			else {$('#slot'+i).removeClass('warning');}
		};
		key = ((x > 25) ? 'table-row' : 'none');
		$('#tbl_SLOT_COUNT').css("display",key);
    },
	
    GetWaferButtonHandler:function () {
        // Build up JSON
        var json = this.encodeJSON("SCHD", "COMMAND", "Aligner", "GETTOP", null, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "getTop");
    },
    
    PutWaferButtonHandler:function () {
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