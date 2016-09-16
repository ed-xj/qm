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
        "change input[name='PORT_DEFINED']":"LoadPortSelectButtonHandler",
        //"change code":"autoScrollDown",						// auto scroll to bottom
        "change div[name='PORT_LOG']>code":"autoScrollDown",	// auto scroll to bottom
		
        "click #btn_mov_PODCL":"CommandButtonHandler",
        "click #btn_mov_YDOOR":"CommandButtonHandler",
        "click #btn_mov_VACON":"CommandButtonHandler",
        "click #btn_mov_DOROP":"CommandButtonHandler",
        "click #btn_mov_DORBK":"CommandButtonHandler",
        "click #btn_mov_ZDRDW":"CommandButtonHandler",
        "click #btn_mov_ZDRUP":"CommandButtonHandler",
        "click #btn_mov_DORFW":"CommandButtonHandler",
        "click #btn_mov_DORCL":"CommandButtonHandler",
        "click #btn_mov_VACOF":"CommandButtonHandler",
        "click #btn_mov_YWAIT":"CommandButtonHandler",
        "click #btn_mov_PODOP":"CommandButtonHandler",

        "click #btn_set_FSBON":"CommandButtonHandler",
        "click #btn_set_FSBOF":"CommandButtonHandler",
        "click #btn_mov_CLOAD":"CommandButtonHandler",
        "click #btn_mov_CULOD":"CommandButtonHandler",
		
        "click #btn_mov_ABORG":"CommandButtonHandler",
        "click #btn_mov_ABORT":"CommandButtonHandler",
        "click #btn_set_RESET":"CommandButtonHandler",
        "click #btn_mov_ORGSH":"CommandButtonHandler",
        "click #btn_get_STATE":"CommandButtonHandler",
        
		"click #btn_SEND":"SendButtonHandler",
		"click #btn_CLEAR":"ClearButtonHandler",
//        "change code[name='robotmsg']":"autoScrollDown",// auto scroll to bottom
    },

//    genLogMsg: function() {
//        for (var i=0; i<Math.floor((Math.random() * 1000) + 1); i++) {
//            this.logmsg += ((new Date()) + ':system log messages ' + i);
//            this.logmsg += '<br>';
//        }
//        this.templateParams = {robotmsg: this.logmsg};
//    },

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
	// JAMES CHECK CORRECTNESS
    render: function () {
        this.templateParams = {robotmsg: this.logmsg};
        $(this.el).html(this.template(this.templateParams));
        this.disableControls(localStorage.userRole);
        return this;
    },
    
    subRender: function() {
        if (this.robotmsg.length != 0) {
            var temp
            for (var i = 0; i <= this.robotmsg.length; i++) {
                temp = this.robotmsg.shift()
                this.callBack(temp)
            };
        }
    },
	
    callBack: function(data) {
        // show message in Message section, and trigger "change" event
        var arrow = " >> "
        if (data.CmdDest === "UI") {
            arrow = " << "
        }
        var d = new Date()
        d = d.getFullYear()+"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+("0"+d.getDate()).slice(-2)+" "+("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2)+":"+("0"+d.getSeconds()).slice(-2)
        $("div[name='PORT_LOG'][value=" + Number(data.Param) + "]>code").append(d + arrow + data.Message + "<br>").trigger("change");
    },

// Button click events
//     showHelpModal: function () {
//         var frameSrc = "/ui/help/index.htm#t=Safety%2FDefinitions.htm";
//         $("#myIframe").attr("src", frameSrc);
//         $("#myModal").modal({show: true});
//     },

//     pickBtnClick: function() {
//         if (this.moveAttr.index !== "idx") {
//             // Build up JSON
//             var json = this.encodeJSON("SCHD", "COMMAND", null, "PICK", null, null);
//             //AJAX POST
//             this.ajaxCall(this.ajaxUrl, json, "pick", this.callBack);
//             // this.motionFunc("pick");
//         } else {
//             alert("Please select correct staion, pose, high-low, linear or index");
//         }
//     },

    CommandButtonHandler: function (e) {
        var key = $(e.currentTarget).attr("id").substring(4,7).toUpperCase();
		var cmd = this.right($(e.currentTarget).attr("id"),5);
//        var cmd = this.right($(e.currentTarget).attr("id"),5)
//        var robotCmd = ""
//        var tmp_cmd = $(e.currentTarget).attr("id")
//        var value = $(e.currentTarget).val()
//        switch (tmp_cmd) {
//            case "rc1":
//                 robotCmd = value
//                 break;
//             case "rc2":
//                 robotCmd = value
//                 break;
//             case "rc3":
//                 robotCmd = value
//                 break;
//             case "rc4":
//                 robotCmd = value
//                 break;
//             case "rc5":
//                 robotCmd = value
//                 break;
//         }
			var msg = key + ":" + cmd + ";"
			this.callBack({Message:msg,Param:this.right($("#pnl_LOG_TITLE>span").text(),1)})   // Robot cmd msg
        // Build up JSON
//        var json = this.encodeJSON("SCHD", "COMMAND", "ROBOT", robotCmd, null, msg);
        //AJAX POST
//        this.ajaxCall(this.ajaxUrl, json, "robotCmd", this.callBack);
    },

    SendButtonHandler: function (e) {
		
    },

    ClearButtonHandler: function (e) {
		$("div[name='PORT_LOG'][value=" + Number(this.right($("#pnl_LOG_TITLE>span").text(),1)) + "]>code").text("").trigger("change");
    },

    LoadPortSelectButtonHandler: function (e) {
        var station = Number(e.currentTarget.value);
		for (var i=1;i<=4;i++)
		{
			if(i === station)
			{
				$("#pnl_LOG_BODY_"+i).show()
				$("#pnl_LOG_TITLE>span").text("PORTID:"+i);
			}
			else
			{
				$("#pnl_LOG_BODY_"+i).hide()
			}
		}
    },
	
    autoScrollDown: function (e) {
        // auto scroll down
        var scrollTarget = $(e.currentTarget).parent().parent();
        scrollTarget.scrollTop(scrollTarget.get(0).scrollHeight); 
    },

    left: function (str, num)
    {
        return str.substring(0,num)
    },

    right: function (str, num)
    {
        return str.substring(str.length-num,str.length)
    },
	
	toBytesInt32: function (num)
	{
		arr = new ArrayBuffer(4); // an Int32 takes 4 bytes
		view = new DataView(arr);
		view.setUint32(0, num, false); // byteOffset = 0; litteEndian = false
		return new Uint8Array(arr);
	},
	
	StringToUint8Array: function ( str )
	{
		var len = str.length;
		var bytletters = new Array( len );
		for (var idx = 0 ; idx < len ; ++idx) {
			bytletters[ idx ] = str.charCodeAt(idx) & 0xFF;
		}
		// You may create an ArrayBuffer from a standard array (of values) as follows:
		return new Uint8Array( bytletters );
	},
	
	UInt8ArrayToString: function (uInt8Array)
	{
		var str = "";
		for(var idx = 0; idx < uInt8Array.length; idx++)
		{
			str += String.fromCharCode(uInt8Array[idx]);
		}
		return str;
	},
	
	concatTypedArrays: function (a, b)
	{ // a, b TypedArray of same type
		var c = new (a.constructor)(a.length + b.length);
		c.set(a, 0);
		c.set(b, a.length);
		return c;
	},
	
	concatBuffers: function (a, b) {
		return concatTypedArrays(
			new Uint8Array(a.buffer || a), 
			new Uint8Array(b.buffer || b)
		).buffer;
	},

    GetCheckSum: function (bytletters)
    {
		var count = 0;
		for (var i = 0; i < bytletters.length; ++i)
		{
			count+=bytletters[i];
		}
		var bytletters = new Uint8Array(this.toBytesInt32(count).slice(-2));
		var checksum = new Uint8Array(2);
		checksum[0] = bytletters[0] * 16 + bytletters[1] / 16;
		if (checksum[0] > 57) {checksum[0] += 39;}
		checksum[1] = bytletters[0] * 16 + bytletters[1] % 16;
		if (checksum[1] > 57) {checksum[1] += 39;}
		return checksum;
    },
	
	CommandCombinations: function (str)
    {
		var data = "00" + str;
		var bytletters = new Uint8Array(this.toBytesInt32(data.length).slice(-2));
		bytletters = this.concatTypedArrays(bytletters,this.StringToUint8Array(data));
		bytletters = this.concatTypedArrays(bytletters,this.GetCheckSum(bytletters));
		return this.UInt8ArrayToString(bytletters);
    },
	
//     leftField: function (str,delimit)
//     {
//         var returnValue=str;
//         var indexNumber=str.indexOf(delimit);
//         if(indexNumber>=0){
//             returnValue = str.substring(0,str.indexOf(delimit))
//         }
//         return returnValue;
//     },

//     rightField: function (str,delimit)
//     {
//         var returnValue=str;
//         var indexNumber=str.indexOf(delimit);
//         if(indexNumber>=0){
//             returnValue = str.substring(indexNumber+delimit.length,str.length)
//         }
//         return returnValue;
//     },
});