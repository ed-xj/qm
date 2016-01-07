// window.TransferView = Backbone.View.extend({
window.TransferView = window.BaseView.extend({
    initialize: function (moderator) {
        this.mode = 'quicksort';
        this.moderator = moderator;
        this.start = null;
        this.targetRecipe = 1;
    },

    events: {
        // "click #splitRadio":"handleSplitMode",
        // "click #mergeRadio":"handleMergeMode",
        "click #quicksortRadio":"handleQuickSortMode",
        "click #resequenceRadio":"handleResequenceMode",
        // quick sort
        "click #slots tr > td":"slotClick",
        "click #updateInventory":"updateInventoryClick",
        "click #submitBtn":"submitBtnClick",
        "click #executeBtn":"executeBtnClick",
        "click #removelastBtn":"removelastBtnClick",
        "click #startBtn":"startBtnClick",
        "click #finishBtn":"finishBtnClick",
        // // split
        // "click #slots tr td:nth-child(7n+2)":"slotClick",   // slot click
        // // Merge
        // "click #srcMergeStationPills li":"pillsSelected",
        // "click #targetMergeStationPills li":"pillsSelected",
        // "click #addSrcStationBtn":"addSrcStationBtnClick",
        // "click #removeSrcStationBtn":"removeSrcStationBtnClick",
        // "click #addTargetStationBtn":"addTargetStationBtnClick",
        // "click #removeTargetStationBtn":"removeTargetStationBtnClick",
        // "click #slotsSrc tr > td":"slotClick",              // source slot click
        // "click #slotsTarget tr > td":"slotClick",           // target slot click
        //resequence
        "click #go":"goBtnClick"
    },

    render: function () {
        var that = this;
        $(this.el).html(this.template());
        setTimeout(function() {
            that.synchMode();
        }, 1);
        // this.stnSlotMapping();
    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",

    callBack: function(data) {

    },

    synchMode: function() {
        // var splitPanel      = $('#splitPanel'),
        //     mergePanel      = $('#mergePanel'),
        var quicksortPanel  = $('#quicksortPanel'),
            resequencePanel = $('#resequencePanel');

        // if (this.mode === 'split') {
        //     splitPanel.show();
        //     mergePanel.hide();
        //     resequencePanel.hide();
        // } else if (this.mode === 'merge') {
        //     splitPanel.hide();
        //     mergePanel.show();
        //     resequencePanel.hide();
        if (this.mode === 'quicksort') {
            // splitPanel.show();
            // mergePanel.hide();
            quicksortPanel.show();
            resequencePanel.hide();
        } else {
            // splitPanel.hide();
            // mergePanel.hide();
            quicksortPanel.hide();
            resequencePanel.show();
        }
    },

    // handleSplitMode: function() {
    //     this.mode = 'split';
    //     this.synchMode(true, false, false);
    // },

    // handleMergeMode: function() {
    //     this.mode = 'merge';
    //     this.synchMode(false, true, false);
    // },

    handleQuickSortMode: function() {
        this.mode = 'quicksort';
        this.synchMode(true, false);
    },

    handleResequenceMode: function() {
        this.mode = 'resequence';
        this.synchMode(false, true);
    },

    stnSlotMapping: function () {
        var stncount = this.moderator.get('station').length
        // all slot mapping
        for (var i = 0; i < stncount; i++) {
            this.slotMapping(this.moderator.get('station')[i],i+1)
        };
    },

    // Split
    // splitInfo: function () {
    //     // bind all data
    //     var splitInfoArray = new Array();
    //     $("#slots tr").each(function(){
    //         if ($(this).hasClass('selected')) {
    //             var thisSlot = $(this).children('th').text()
    //             // build up JSON
    //             splitInfoArray.push({
    //                 targetstn : Number($('#targetStationForSlot'+thisSlot).val()),
    //                 targetslot : Number($('#targetSlotForSlot'+thisSlot).val()),
    //                 align : $(this).children('td:eq(3)').children().children().is(':checked'),
    //                 ocr : $(this).children('td:eq(4)').children().children().is(':checked'),
    //                 flip : $(this).children('td:last').children().children().is(':checked')
    //             })
    //         } else {
    //             splitInfoArray.push(null);
    //         }
    //     });
    //     // Build up JSON
    //     var json = encodeJSON("SCHD", "COMMAND", "station"+$('#srcStation').val(), "SPLIT", splitInfoArray, null);
    //     // AJAX POST
    //     this.ajaxCall(this.ajaxUrl, json, "transfer - split");
    // },

    slotMapping: function (data) {
        var map = data.map
        var waferid = data.waferID 
        var stnid = ".stn"+data.stationID
        // clear slots color and text
        $(stnid).children().children("td").text("")
        $(stnid).children().children("td").removeClass("full");
        // render slots color with yellow if there is a wafer
        for (i=0; i<map.length; i++) {
            if (map[i]===1) {
                $(stnid).children().children("#slot"+(i+1)).text(waferid[i]); //waferid
                $(stnid).children().children("#slot"+(i+1)).addClass('full');
            }
        }
    },

    slotClick: function (e) {
        if (this.start !== null) {
            var slotTarget = $(e.currentTarget);
            var selected_slot = slotTarget.parent().parent().children();
            var station = slotTarget.parent().parent().attr("class");
            if (this.start) {
                if(!slotTarget.parent().hasClass('finish')) {
                    if (slotTarget.parent().hasClass('start')) {
                        $('.start').removeClass('start')
                        $('#startfield').val("")
                    } else {
                        $('.start').removeClass('start')
                        slotTarget.parent().addClass('start');
                        $('#startfield').val(station+slotTarget.attr('id'));
                        console.log("select start:"+station + ', ' +  slotTarget.attr('id'));
                    }
                }
            } else {
                if (!slotTarget.parent().hasClass('start')) {
                    if (slotTarget.parent().hasClass('finish')) {
                        $('.finish').removeClass('finish')
                        $('#finishfield').val("");
                    } else {
                        $('.finish').removeClass('finish')
                        slotTarget.parent().addClass('finish');
                        $('#finishfield').val( station+slotTarget.attr('id'));
                        console.log("select finish:"+station + ', ' +  slotTarget.attr('id'));
                    }
                }
            }
        }
    },

    updateInventoryClick: function () {
        // this.stnSlotMapping();
        var stncount = this.moderator.get('station').length
        // all slot mapping
        for (var i = 0; i < stncount; i++) {
            this.slotMapping(this.moderator.get('station')[i],i+1)
        };
        console.log("inventory updated.")
    },

    submitBtnClick: function () {
        var start = $('#startfield').val(),
            finish = $('#finishfield').val();
        if (start === "") {
            alert("please input start slot")
            if (finish === "")
                    alert("please input finish slot")
        } else {
            if (finish === "")
                alert("please input finish slot")
            else {
                var recipe = start+"_"+finish;
                if ($('#ocrCheckbox').is(':checked'))
                    recipe = recipe+"_O"
                if($('#alignCheckbox').is(':checked'))
                    recipe = recipe+"_A"
                if($('#flipCheckbox').is(':checked'))
                    recipe = recipe+"_F"
                
                // for (var i = 1; i <= 25; i++) {
                //     if ($('#recipe'+i).text() === "") {
                //         $('#recipe'+i).text(recipe);
                //         break;
                //     }
                // };
                $('#recipe'+this.targetRecipe).text(recipe);
                this.targetRecipe++;
                if (this.targetRecipe > 25) {
                    this.targetRecipe = 25;
                    alert("no more space");
                }
            }
        }
    },

    executeBtnClick: function () {
        // Build up JSON
        var recipes = {}
        var json = encodeJSON("SCHD", "COMMAND", null, "QUICKSORT", recipes, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "transfer - quicksort");
    },

    removelastBtnClick: function () {
        // for (var i = 25; i >=0; i--) {
        //     if ($('#recipe'+i).text() !== "") {
        //         $('#recipe'+i).text("");
        //         break;
        //     }
        // }
        $('#recipe'+(this.targetRecipe-1)).text("");
        this.targetRecipe--;
        if (this.targetRecipe < 1) {
            this.targetRecipe = 1;
            alert("no recipes")
        }
    },

   startBtnClick: function () {
        if (!this.start || this.start === null) {
            this.start = true;
            console.log("start selecting...")
        }
    },

    finishBtnClick: function () {
        if (this.start || this.start === null) {
            this.start = false;
            console.log("finish selecting...")
        }
    },

    // Merge
    // mergeInfo: function () {

    // },

    // pillsSelected: function (e) {
    //     var li = $(e.currentTarget)
    //     if (li.hasClass('selected'))
    //         li.removeClass('selected')
    //     else
    //         li.addClass('selected')
    // },

    // addSrcStationBtnClick: function () {
    //     var exist = $('#srcMergeStationPills li a').text()
    //     var srcstn = "Station" + $('#srcMergeStation').val()
    //     if (exist.search(srcstn) < 0)
    //         $('#srcMergeStationPills').append("<li><a href='#'>"+srcstn+"</a></li>")
    //     else
    //         alert(srcstn+" is already in the list.")
    // },

    // removeSrcStationBtnClick: function () {
    //     var exist = $('#srcMergeStationPills li a').text()
    //     var srcstn = "Station" + $('#srcMergeStation').val()
    //     var index = exist.search(srcstn)
        
    //     if ($('#srcMergeStationPills li').hasClass('selected'))
    //         $('#srcMergeStationPills li.selected').remove()
    //     else {
    //         if (index >= 0)
    //             $('#srcMergeStationPills li:nth-child('+((index/8)+1)+')').remove()
    //         else
    //             alert(srcstn+" is not in the list.")
    //     }
    // },

    // addTargetStationBtnClick: function () {
    //     var exist = $('#targetMergeStationPills li a').text()
    //     var srcstn = "Station" + $('#targetMergeStation').val()
    //     if (exist.search(srcstn) < 0)
    //         $('#targetMergeStationPills').append("<li><a href='#'>"+srcstn+"</a></li>")
    //     else
    //         alert(srcstn+" is already in the list.")
    // },

    // removeTargetStationBtnClick: function () {
    //     var exist = $('#targetMergeStationPills li a').text()
    //     var srcstn = "Station" + $('#targetMergeStation').val()
    //     var index = exist.search(srcstn)
    //     if ($('#targetMergeStationPills li').hasClass('selected'))
    //         $('#targetMergeStationPills li.selected').remove()
    //     else {
    //         if (index >= 0)
    //             $('#targetMergeStationPills li:nth-child('+((index/8)+1)+')').remove()
    //         else
    //             alert(srcstn+" is not in the list.")
    //     }
    // },

    // Resequence
    resequence: function() {
        // Build up JSON
        var reseq = {
            sortorder: $('input[name=sortOrder]:checked').attr('id').toUpperCase(),
            idmask: $('#idMask').val(),
            srcstation: Number($('#reqSrcStation').val()),
            targetstation: Number($('#reqTargetStation').val())
        }
        var json = encodeJSON("SCHD", "COMMAND", null, "RESEQUENCE", reseq, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "transfer - resequence");
    },

    goBtnClick: function() {
        if (this.mode === 'quicksort') {

        } else if (this.mode ==='resequence') {
            this.resequence()
        } else
            alert('Transfer mode error, please select again.');
    }
});
