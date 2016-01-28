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
        "click #updateInventoryBtn":"updateInventoryClick",
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
        // add handle radio btn click function
        "click #go":"goBtnClick"
    },

    render: function () {
        var that = this;
        $(this.el).html(this.template());
        setTimeout(function() {
            that.synchMode();
        }, 1);
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
            } else if (waferid[i] === "X") {
                 $(stnid).children().children("#slot"+(i+1)).addClass('disable');
                  $(stnid).children().children("#slot"+(i+1)).text("X");
            }
        }
    },

    slotClick: function (e) {
        if (this.start !== null) {
            var slotTarget = $(e.currentTarget);
            if (!slotTarget.hasClass('disable') && !slotTarget.hasClass('doing')) {
                var station = slotTarget.parent().parent().attr("class");
                if (this.start && slotTarget.hasClass('full')) {
                    if (slotTarget.hasClass('start')) {
                        $('.start').removeClass('start')
                        $('#startfield').val("")
                    } else {
                        $('.start').removeClass('start')
                        slotTarget.addClass('start');
                        $('#startfield').val(station+slotTarget.attr('id'));
                        console.log("select start:"+station + ', ' +  slotTarget.attr('id'));
                    }
                } else if (!this.start && !slotTarget.hasClass('full')) {
                    if (slotTarget.hasClass('finish')) {
                        $('.finish').removeClass('finish')
                        $('#finishfield').val("");
                    } else {
                        $('.finish').removeClass('finish')
                        slotTarget.addClass('finish');
                        $('#finishfield').val(station+slotTarget.attr('id'));
                        console.log("select finish:"+station + ', ' +  slotTarget.attr('id'));
                    }
                }
            }
        }
    },

    updateInventoryClick: function () {
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
                var recipe = start+","+finish;
                if ($('#ocrCheckbox').is(':checked'))
                    recipe = recipe+",O"
                if($('#alignCheckbox').is(':checked'))
                    recipe = recipe+",A"
                if($('#flipCheckbox').is(':checked'))
                    recipe = recipe+",F"
                
                $('#recipe'+this.targetRecipe).text(recipe);
                $('.start').text("S"+this.targetRecipe);
                $('.finish').text("T"+this.targetRecipe);
                $('.start').addClass('recipe'+this.targetRecipe);
                $('.finish').addClass('recipe'+this.targetRecipe);
                $('.recipe'+this.targetRecipe).addClass('doing');
                this.targetRecipe++;
                if (this.targetRecipe > 25) {
                    this.targetRecipe = 25;
                    alert("no more space");
                }
                $('.start').removeClass('start');
                $('.finish').removeClass('finish');
                this.start = null;
                $('#startfield').val("");
                $('#finishfield').val("");
                $('#startfield').css('background-color','white');
                $('#finishfield').css('background-color','white');
                $('#updateInventoryBtn').prop('disabled', true);
            }
        }
    },

    executeBtnClick: function () {
        if (this.targetRecipe > 1) {
            // Build up JSON
            var recipesArray = new Array()
            $("#recipes td").each(function(){
                if ($(this).text() !== "") {
                    recipesArray.push($(this).text());
                }
            });
            var json = encodeJSON("SCHD", "COMMAND", null, "QUICKSORT", recipesArray, null);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "transfer - quicksort");
            this.start = null;
            $('#startfield').css('background-color','white');
            $('#finishfield').css('background-color','white');
        } else {
            alert("no repies to execute")
        }
    },

    removelastBtnClick: function () {
        var that = this;
        $('#recipe'+(this.targetRecipe-1)).text("");    // recipe table (right)

        $('.recipe'+(this.targetRecipe-1)).each( function () {
            if ($(this).hasClass('full')) {
                var stn = $(this).parent().parent('tbody').attr('class');
                var slot = $(this).siblings('th').text();
                stn = stn.match(/\d+$/);
                var wid = that.moderator.get('station')[stn-1].waferID[parseInt(slot,10)-1];
                $(this).text(wid);
            }
            else
                $(this).text("")
        })     // station slot (left)
        $('.recipe'+(this.targetRecipe-1)).removeClass('doing');
        $('.recipe'+(this.targetRecipe-1)).removeClass('recipe'+(this.targetRecipe-1));     // station slot (left)
        this.targetRecipe--;
        if (this.targetRecipe < 1) {
            this.targetRecipe = 1;
            alert("no recipes")
        } else if (this.targetRecipe === 1) {
            $('#updateInventoryBtn').prop('disabled', false);
        }
        this.start = null;
    },

   startBtnClick: function () {
        if (!this.start || this.start === null) {
            this.start = true;
            $('#startfield').css('background-color','lightblue')
            $('#finishfield').css('background-color','white')
            console.log("start selecting...")
        }
    },

    finishBtnClick: function () {
        if (this.start) {
            if ($('#startfield').val() !== "") {
                this.start = false;
                $('#startfield').css('background-color','white')
                $('#finishfield').css('background-color','lightblue')
                console.log("finish selecting...")
            }
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
            this.executeBtnClick();
        } else if (this.mode ==='resequence') {
            this.resequence();
        } else
            alert('Transfer mode error, please select again.');
    }
});
