// window.TransferView = Backbone.View.extend({
window.TransferView = window.BaseView.extend({
    initialize: function (moderator) {
        this.mode = 'quicksort';
        this.moderator = moderator;
        this.moderator.on('lang:change', this.onLangChange.bind(this));
        this.start = null;
        this.targetRecipe = 1;
        this.updatedInven = false;
        this.sourceSlot = []
        this.stepCount = []
        this.groupSelect = false
    },

    events: {
        "change label>#quicksortRadio":"handleQuickSortMode",
        "change label>#resequenceRadio":"handleResequenceMode",
        "click #go":"goBtnClick",
        // quick sort
        // "click #onoff":"onoffStations",
        "click #show-slide-panel":"slideOut",
        "click #slots tr > td":"slotClick",
        "click input[for='selection']":"selectionChkClick",
        "click .onlyCheckbox":"onlyChkClick",
        "click input[for='move']":"moveChkClick",
        "click input[for='order']":"orderChkClick",
        "click #currentRecipeBtn":"showCurrentRecipeClick",
        "click #updateInventoryBtn":"updateInventoryClick",
        "click #submitBtn":"submitBtnClick",
        "click #executeBtn":"executeBtnClick",
        "click #removelastBtn":"removelastBtnClick",
        // "click #startBtn":"startBtnClick",
        // "click #finishBtn":"finishBtnClick",
        // "dragstart #slots tr > td": "slotDrag",
        // "drop #slots tr > td": "slotDrop",
        // "dragover #slots tr > td": "slotAllowDrop",
        "contextmenu #slots tr > td":"slotRightClick"
    },

    slideOut: function () {   
        var panel = $('#slide-panel');
        if (!panel.hasClass("visible")) {
            panel.addClass('visible').animate({'margin-left':'-300px'});
        } else {
            panel.removeClass('visible').animate({'margin-left':'0px'});
        }
    },

    slotAllowDrop: function (e) {
        e.preventDefault();
    },

    slotDrag: function (e) {
        var slot = $(e.currentTarget)
    },

    slotDrop: function (e) {
        e.preventDefault();
        // $(e.currentTarget).text(this.sourceSlot[0]+this.sourceSlot[1]+this.sourceSlot[2])
        var slot = $(e.currentTarget)
        var msg = this.sourceSlot[0]+this.sourceSlot[1]+this.sourceSlot[2]
        var finish = [slot.parent().parent().attr("class"), slot.attr("id"), slot.text()]
        slot.addClass("success").text("From:"+this.sourceSlot[0]+this.sourceSlot[1])
        $(".start").attr("name",this.sourceSlot[2])
        $(".start").addClass("success").removeClass("info").text("To:"+finish[0]+finish[1]).removeClass("start")
        this.start = false
        this.submitBtnClick(this.sourceSlot, finish)
    },

    render: function () {
        var that = this;
        $(this.el).html(this.template());
        setTimeout(function() {
            this.mode = 'quicksort';
            that.synchMode(true, false);
        }, 1);
    },

    onLangChange: function() {
        console.log('TransferView::onLangChange');
        this.render()
    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",

    callBack: function(data) {

    },

    synchMode: function() {
        var quicksortPanel  = $('#quicksortPanel'),
            resequencePanel = $('#resequencePanel');

        if (this.mode === 'quicksort') {
            quicksortPanel.show();
            resequencePanel.hide();
        } else {
            quicksortPanel.hide();
            resequencePanel.show();
        }
    },

    handleQuickSortMode: function() {
        this.mode = 'quicksort';
        this.synchMode(true, false);
    },

    handleResequenceMode: function() {
        this.mode = 'resequence';
        this.synchMode(false, true);
    },

    // onoffStations: function (e) {
    //     var station = $(e.currentTarget);
    //     if (station.hasClass('active')) {
    //         $("td#"+station.val()).hide()
    //     } else {
    //         $("td#"+station.val()).show()
    //     }
    // },

    stnSlotMapping: function () {
        var stncount = this.moderator.get('station').length
        // all slot mapping
        for (var i = 0; i < stncount; i++) {
            this.slotMapping(this.moderator.get('station')[i],i+1)
        };
    },

    slotMapping: function (data) {
        var map = data.map
        var waferid = data.waferID 
        var stnid = ".stn"+data.stationID
        // clear slots color and text
        $(stnid).children().children("td").text("")
        $(stnid).children().children("td").removeClass("warning");
        // render slots color with yellow if there is a wafer
        for (i=0; i<map.length; i++) {
            if (map[i]===1) {
                $(stnid).children().children("#slot"+(i+1)).text(waferid[i]); //waferid
                $(stnid).children().children("#slot"+(i+1)).addClass('warning');
            } else if (waferid[i] === "X") {
                 $(stnid).children().children("#slot"+(i+1)).addClass('disable');
                  $(stnid).children().children("#slot"+(i+1)).text("X");
            }
        }
    },

    slotClick: function (e) {
        var slot = $(e.currentTarget)
        if (!slot.hasClass('disable')) {
            if (!this.groupSelect) {
                if (!this.start) {
                    if (slot.hasClass("warning")) {
                        slot.removeClass("warning")
                        this.sourceSlot = [slot.parent().parent().attr("class"), slot.attr("id"), slot.text()]
                        slot.addClass("info")
                        slot.addClass("start")
                        this.start = true
                    }
                } else {
                    if (slot.hasClass("warning")) {
                        alert("Warning! This slot could not be selected. Please select another slot.")
                    } else if (slot.hasClass("info")) {
                        slot.addClass("warning").removeClass("info").removeClass("start")
                        this.start = false
                    } else {
                        var msg = this.sourceSlot[0]+this.sourceSlot[1]+this.sourceSlot[2]
                        var finish = [slot.parent().parent().attr("class"), slot.attr("id"), slot.text()]
                        slot.addClass("success").text("From:"+this.sourceSlot[0]+this.sourceSlot[1])
                        $(".start").attr("name",this.sourceSlot[2])
                        $(".start").addClass("success").removeClass("info").text("To:"+finish[0]+finish[1]).removeClass("start")
                        this.start = false
                        this.stepCount.push(1)
                        this.submitBtnClick(this.sourceSlot, finish)
                    }
                }
            } else {
                if ((this.sourceSlot[0] === slot.parent().parent().attr("class")) && this.start) {
                    var to = 0
                    var from = 0 
                    if (Number(slot.attr("id").substring(4)) > Number(this.sourceSlot[1].substring(4))) {
                        from = Number(this.sourceSlot[1].substring(4))
                        to = Number(slot.attr("id").substring(4))
                    } else {
                        to = Number(this.sourceSlot[1].substring(4))
                        from = Number(slot.attr("id").substring(4))
                    }
                    for (var i = from; i <= to; i++) {
                        $("."+this.sourceSlot[0]+" #slot"+i).removeClass("warning").addClass("info")
                    }
                    this.stepCount.push((to - from)+1)
                    // this.start = false
                } else {
                    // if (!this.start) {
                    //     alert("Warning! Group mode can not select to another station.")
                    // } else {

                    // }
                    if (slot.hasClass("warning")) {
                        slot.removeClass("warning")
                        this.sourceSlot = [slot.parent().parent().attr("class"), slot.attr("id"), slot.text()]
                        slot.addClass("info")
                        slot.addClass("start")
                        this.start = true
                    } else {
                        // render
                        this.start = false
                    }
                }
            }
        } else {
            alert("Warning! This slot is not available, please select another slot.")
        }
    },    

    slotRightClick: function (e) {
        e.preventDefault();
        var slot = $(e.currentTarget)
        if (!slot.hasClass('disable')) {
            if (!this.start) {
                if (slot.hasClass("warning")) {
                    slot.removeClass("warning")
                    this.sourceSlot = [slot.parent().parent().attr("class"), slot.attr("id"), slot.text()]
                    slot.addClass("info")
                    slot.addClass("start")
                    // this.start = true
                    this.groupSelect = true
                } else {
                    alert("Warning! This slot is not available")
                }
            }
        }
    },

    selectionChkClick: function (e) {        
        var selection = $(e.currentTarget).attr("id")
        if ($("#"+selection).is(":checked")) {
            $("input[for='selection']").prop("checked", "")
            $("#"+selection).prop("checked", "checked")
        } else {
            $("#"+selection).prop("checked", "")
        }

        if ($("#groupCheckbox").is(":checked")) {
            this.groupSelect = true
        } else {
            this.groupSelect = false
        }
    },

    onlyChkClick: function (e) {
        var only = $(e.currentTarget).attr("for")

        if (only==="ocr") {
            if ($("input[for='ocr']").is(":checked")) {
                $(".onlyCheckbox").prop("checked", "")
                $("input[for='ocr']").prop("checked", "checked")
            } else {
                $("input[for='ocr']").prop("checked", "")
            }
        } 
        if (only==="align") {
            if ($("input[for='align']").is(":checked")) {
                $(".onlyCheckbox").prop("checked", "")
                $("input[for='align']").prop("checked", "checked")
            } else{
                $("input[for='align']").prop("checked", "")
            }           
        }

        $("input[for='move']").prop("checked", "");   
        $("input[for='order']").prop("checked", "");
    },

    moveChkClick: function () {
        $(".onlyCheckbox").prop("checked", "")
        $("input[for='order']").prop("checked", "");
    },

    orderChkClick: function (e) {
        var order = $(e.currentTarget).attr("id")
        if ($("#"+order).is(":checked")) {
            $("input[for='order']").prop("checked", "")
            $("#"+order).prop("checked", "checked")
        } else {
            $("#"+order).prop("checked", "")
        }
        $("input[for='move']").prop("checked", "");   
        $(".onlyCheckbox").prop("checked", "")
    },

    showCurrentRecipeClick: function () {
        $("#currentRecipeModal").modal({show: true});
    },

    updateInventoryClick: function () {
        var stncount = this.moderator.get('station').length
        // all slot mapping
        for (var i = 0; i < stncount; i++) {
            this.slotMapping(this.moderator.get('station')[i],i+1)
        };
        console.log("inventory updated.")
    },

    submitBtnClick: function (start, finish) {
        start = start[0]+"_"+start[1]+"_"+start[2]
        finish = +finish[0]+"_"+finish[1]+"_"+finish[2]
        var recipe = start+","+finish;
        if ($('#ocrCheckbox').is(':checked'))
            recipe = recipe+",O"
        if($('#alignCheckbox').is(':checked'))
            recipe = recipe+",A"
        if($('#flipCheckbox').is(':checked'))
            recipe = recipe+",F"
        
        $('#recipe'+this.targetRecipe).text(recipe);
        $('.recipe'+this.targetRecipe).addClass('doing');
        this.targetRecipe++;
        if (this.targetRecipe > 25) {
            this.targetRecipe = 25;
            alert("no more space");
        }
        $('.start').removeClass('start');
        this.start = null;
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
            var json = this.encodeJSON("SCHD", "COMMAND", "TRANSFER", "QUICKSORT", recipesArray, null);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "transfer - quicksort");
            this.start = null;
        } else {
            alert("no repies to execute")
        }
    },

    removelastBtnClick: function () {
        if (this.targetRecipe === 1) {
            alert("Warning! No recipe to remove.")
        } else {
                var recipe, recipe_arr, finish_arr, start_arr, start, finish
            for (var i = 0; i < this.stepCount.pop(); i++) { 
                recipe = $('#recipe'+(this.targetRecipe-1)).text()
                $('#recipe'+(this.targetRecipe-1)).text("");
                recipe_arr = recipe.split(",")
                finish_arr = recipe_arr[1].split("_")
                start_arr = recipe_arr[0].split("_")
                start = $("."+start_arr[1]+" #"+start_arr[2])
                finish = $("."+finish_arr[1]+" #"+finish_arr[2])
                start.addClass("warning").removeClass("success")
                start.text(start.attr("name"))
                finish.removeClass("success").text("")

                this.targetRecipe--;
                if (this.targetRecipe < 1) {
                    this.targetRecipe = 1;
                    alert("no recipes")
                }
            };            
            this.start = null;
        }
    },

    // Resequence
    resequence: function() {
        // Build up JSON
        var reseq = {
            sortorder: $('label[name=sortOrder].active').attr('id').toUpperCase(),
            idmask: $('#idMask').val(),
            srcstation: Number($('#reqSrcStation').val().toUpperCase()),
            targetstation: Number($('#reqTargetStation').val().toUpperCase())
        }
        var json = this.encodeJSON("SCHD", "COMMAND", "TRANSFER", "RESEQUENCE", reseq, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "transfer - resequence", this.callBack);
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
