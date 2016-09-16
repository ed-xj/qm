window.RecipeView = window.BaseView.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
        this.moderator.on('lang:change', this.onLangChange.bind(this));
        this.moderator.on('recipe:load', this.onRecipeLoad.bind(this));
        this.unloadOrder1 = 'b2t';
        this.unloadOrder2 = 'b2t';
        this.recipe = [];
        that = this
    },

    station_id: "recipe",

    events : {
        "click #recipeName": "showRecipeModal",      // recipe modal
        "click #loadRecipe":"loadRecipeBtnClick",     // save recipe
        "click .chk-all":"chkAllClick",               // check all
        "click .chk-odd":"chkODDClick",               // check all
        "click .chk-none":"chkNoneClick",             // check none
        "click .chk-element":"chkElemClick",          // check element
        "click #saveRecipe":"saveRecipeBtnClick",     // save recipe
        "click #done":"loadRecipeBtnClick",     // load recipe
        "change input[name='unloadOrder1']": "updateUnloadOrder1",  // change order of slots
        "change input[name='unloadOrder2']": "updateUnloadOrder2",
        "change input[name='usage1']":"updateUsage1",   // enable/disable seq 1
        "change input[name='usage2']":"updateUsage2"    // enable/disable seq 2
    },

    activate: function() {
        
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",

    callBack: function(data) {
            // {
            //     "name":"testingrecipt.rc",
            //     "source":{
            //         "order":"t2b",
            //         "source":"Input3",
            //         "index":[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1]
            //     },
            //     "destination":{
            //         "order":"b2t",
            //         "source":"Input8",
            //         "index":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            //     },
            //     "type":"A_TYPE",
            //     "process1":{
            //         "usage":"0",
            //         "sequence":[]
            //     },
            //     "process2":{
            //         "usage":"1",
            //         "sequence":[{"CMD":"1","DATA":"222","GOTO":"3"},{"CMD":"11","DATA":"2","GOTO":"3"}]
            //     }
            // },
        $("#recipeName").val(data.Param.name)    // recipe name
        if(data.Param.source.order==="b2t") {   // source unload order
            $("input[name='unloadOrder1'][value=1]").click()
        } else {
            $("input[name='unloadOrder1'][value=2]").click()
        }

        $("select[name='src-stn']").val(data.Param.source.source).change()
        if(data.Param.destination.order==="b2t") {  // destination unload order
            $("input[name='unloadOrder2'][value=1]").click()
        } else {
            $("input[name='unloadOrder2'][value=2]").click()
        }

        this.that.loadSlots(data.Param.source.index, data.Param.destination.index)  // slot click

        $("select[name='dest-stn']").val(data.Param.destination.source)
        $("input[name='type']").parent('.active').removeClass('active')
        $("input[value='"+data.Param.type+"']").parent("label").addClass('active')
        if(data.Param.process1.usage==="0") {  // destination unload order
            $("input[name='usage1'][value='0']").click()
        } else {
            $("input[name='usage1'][value='1']").click()
        }
        if(data.Param.process2.usage==="0") {  // destination unload order
            $("input[name='usage2'][value='0']").click()
        } else {
            $("input[name='usage2'][value='1']").click()
        }
        this.that.loadSequence(data.Param.process1.sequence,data.Param.process2.sequence)
    },

    onLangChange: function() {
        console.log('RecipeView::onLangChange');
        this.render()
    },

    onRecipeLoad: function() {
        console.log('RecipeView::onRecipeLoad');
        this.recipe.push(this.moderator.get("recipe"))
    }, 

    showRecipeModal: function () {
        $("#recipeModal").modal({show: true});
    },

    chkAllClick:function (e) {
        // var chkGroup = $(e.currentTarget).parents(".chk-group:first");
        // chkGroup.find(".chk-element").prop("checked", "checked");
        // chkGroup.find(".chk-none").prop("checked", "");
        // chkGroup.find(".chk-odd").prop("checked", "");
        // chkGroup.find(".chk-all").prop("checked", "checked");
        var name = $(e.currentTarget).parent().attr("name");
        var chkGroup = $("#"+name+":first");
        chkGroup.find(".chk-element").prop("checked", "checked");
        $(name+".chk-none").removeClass("active");
        $(name+".chk-odd").removeClass("active");
        $(name+".chk-all").addClass("active");
    },

    chkODDClick: function (e) {
        // var chkGroup = $(e.currentTarget).parents(".chk-group:first");
        // chkGroup.find(".chk-element").prop("checked", "");
        // chkGroup.find(".chk-element:even").prop("checked", "checked");
        // chkGroup.find(".chk-none").prop("checked", "");
        // chkGroup.find(".chk-all").prop("checked", "");
        // chkGroup.find(".chk-odd").prop("checked", "checked");
        var name = $(e.currentTarget).parent().attr("name");
        var chkGroup = $("#"+name+":first");
        chkGroup.find(".chk-element").prop("checked", "");
        chkGroup.find(".chk-element:even").prop("checked", "checked");
        $(name+".chk-none").removeClass("active");
        $(name+".chk-odd").addClass("active");
        $(name+".chk-all").removeClass("active");
    },

    chkNoneClick:function (e) {
        // var chkGroup = $(e.currentTarget).parents(".chk-group:first");
        // chkGroup.find(".chk-element").prop("checked", "");
        // chkGroup.find(".chk-all").prop("checked", "");
        // chkGroup.find(".chk-odd").prop("checked", "");
        // chkGroup.find(".chk-none").prop("checked", "checked");
        var name = $(e.currentTarget).parent().attr("name");
        var chkGroup = $("#"+name+":first");
        chkGroup.find(".chk-element").prop("checked", "");
        $(name+".chk-none").addClass("active");
        $(name+".chk-odd").removeClass("active");
        $(name+".chk-all").removeClass("active");
    },

    chkElemClick:function (e) {
        // var chkGroup = $(e.currentTarget).parents(".chk-group:first");
        var chkGroup = $(e.currentTarget).parents(".chk-group:first");
        var name = "div[name='"+chkGroup.attr("id")+"'] > ";
        if (chkGroup.find(".chk-element:checked").length == chkGroup.find(".chk-element").length) {
            // chkGroup.find(".chk-all").prop("checked", "checked");
            // chkGroup.find(".chk-none").prop("checked", "");
            $(name+".chk-none").removeClass("active");
            $(name+".chk-odd").removeClass("active");
            $(name+".chk-all").addClass("active");
        } else if (chkGroup.find(".chk-element:checked").length == 0) {
            // chkGroup.find(".chk-none").prop("checked", "checked");
            // chkGroup.find(".chk-all").prop("checked", "");
            $(name+".chk-none").addClass("active");
            $(name+".chk-odd").removeClass("active");
            $(name+".chk-all").removeClass("active");
        } else if (chkGroup.find(".chk-element:even:checked").length===13 && chkGroup.find(".chk-element:odd:checked").length === 0) {
            // chkGroup.find(".chk-none").prop("checked", "checked");
            // chkGroup.find(".chk-all").prop("checked", "");
            $(name+".chk-none").removeClass("active");
            $(name+".chk-odd").addClass("active");
            $(name+".chk-all").removeClass("active");
        }else {
            // chkGroup.find(".chk-all").prop("checked", "");
            // chkGroup.find(".chk-none").prop("checked", "");
            $(name+".chk-none").removeClass("active");
            $(name+".chk-odd").removeClass("active");
            $(name+".chk-all").removeClass("active");
        }
    },

    reverseSlots: function(id) {
        var selector = 'div#' + id;
        var elem = this.$(selector);
        var checks = elem.children('div.checkbox').get();
        // var all = checks.shift();
        // var odd = checks.shift();
        // var none = checks.shift();
        // elem.append([all, none].concat(checks.reverse()));

        elem.append(checks.reverse());
    },

    updateUnloadOrder1: function(e) {
        if ($.isNumeric(e)) {
            var val = e
        } else {
            var val = e.currentTarget.value;
        }
        switch (val) {
            case '1':
                if (this.unloadOrder1 == 't2b') {
                    this.reverseSlots("unloadOrder1");
                    this.unloadOrder1 = 'b2t';
                }
                break;
            case '2':
                if (this.unloadOrder1 == 'b2t') {
                    this.reverseSlots("unloadOrder1");
                    this.unloadOrder1 = 't2b';
                }
                break;
        }
    },

    updateUnloadOrder2: function(e) {
        if ($.isNumeric(e)) {
            var val = e
        } else {
            var val = e.currentTarget.value;
        }
        switch (val) {
            case '1':
                if (this.unloadOrder2 == 't2b') {
                    this.reverseSlots("unloadOrder2");
                    this.unloadOrder2 = 'b2t';
                }
                break;
            case '2':
                if (this.unloadOrder2 == 'b2t') {
                    this.reverseSlots("unloadOrder2");
                    this.unloadOrder2 = 't2b';
                }
                break;
        }
    },

    updateUsage1:function(e) {
        if ($.type(e) === "string") {
            var val = e
        } else {
            var val = e.currentTarget.value;
        }
        switch (val) {
            case '0':
                $('#sequence1 tr td').children('input').attr("readonly", true)
                $('#sequence1 tr td').children('input').attr("disabled", "disabled")
                break;
            case '1':
                $('#sequence1 tr td').children('input').attr("readonly", false)
                $('#sequence1 tr td').children('input').removeAttr("disabled")
                break;
        }
    },

    updateUsage2:function(e) {
        if ($.type(e) === "string") {
            var val = e
        } else {
            var val = e.currentTarget.value;
        }
        switch (val) {
            case '0':
                $('#sequence2 tr td').children('input').attr("readonly", true)
                $('#sequence2 tr td').children('input').attr("disabled", "disabled")
                break;
            case '1':
                $('#sequence2 tr td').children('input').attr("readonly", false)
                $('#sequence2 tr td').children('input').removeAttr("disabled")
                break;
        }
    },  

    unloadOrder: function () {
        var element1 = new Array()
        var element2 = new Array()
        // if ($('#unloadOrder1 .chk-all').is(':checked')) {
        if ($('#unloadOrder1 .chk-all').hasClass('active')) {
            element1 = Array.apply(null, Array(25)).map(Number.prototype.valueOf,1);
        // } else if ($('#unloadOrder1 .chk-none').is(':checked')){
        } else if ($('#unloadOrder1 .chk-none').hasClass('active')){
            element1 = Array.apply(null, Array(25)).map(Number.prototype.valueOf,0);
        } else {
            $('#unloadOrder1 .chk-element').each( function() {
                if ($(this).is(':checked'))
                    element1.push(1)
                else
                    element1.push(0)
            })
        }
        var src = {
            order:this.unloadOrder1,
            source:$("select[name='src-stn']").val(),
            index:element1
        }

        // if ($('#unloadOrder2 .chk-all').is(':checked')) {
        if ($('#unloadOrder2 .chk-all').hasClass('active')) {
            element2 = Array.apply(null, Array(25)).map(Number.prototype.valueOf,1);
        // } else if ($('#unloadOrder2 .chk-none').is(':checked')){
        } else if ($('#unloadOrder2 .chk-none').hasClass('active')){
            element2 = Array.apply(null, Array(25)).map(Number.prototype.valueOf,0);
        } else {
            $('#unloadOrder2 .chk-element').each( function() {
                if ($(this).is(':checked'))
                    element2.push(1)
                else
                    element2.push(0)
            })
        }
        var dest = {
            order:this.unloadOrder2,
            source:$("select[name='dest-stn']").val(),
            index:element2
        }
        return {
            src:src,
            dest:dest
        }
    },

    sequence: function () {
        var sequence1 = new Array()
        var sequence2 = new Array()
        $('#sequence1 tr').each( function () {
            if ( $(this).children('td:eq(1)').children().val() !== "") {
                sequence1.push({
                    CMD:$(this).children('td:eq(1)').children().val(),
                    DATA:$(this).children('td:eq(2)').children().val(),
                    GOTO: $(this).children('td:eq(3)').children().val()
                })
            }
        })
        $('#sequence2 tr').each( function () {
            if ( $(this).children('td:eq(1)').children().val() !== "") {
                sequence2.push({
                    CMD:$(this).children('td:eq(1)').children().val(),
                    DATA:$(this).children('td:eq(2)').children().val(),
                    GOTO: $(this).children('td:eq(3)').children().val()
                })
            }
        })

        return {
            seq1:sequence1,
            seq2:sequence2
        }
    },

    loadSequence: function (sequence1, sequence2) {
        if (sequence1.length !== 0) {
            sequence1.forEach( function (item, index) {
                $('#sequence1 tr:eq('+index+')').children('td:eq(1)').children('input').val(item.CMD)
                $('#sequence1 tr:eq('+index+')').children('td:eq(2)').children('input').val(item.DATA)
                $('#sequence1 tr:eq('+index+')').children('td:eq(3)').children('input').val(item.GOTO)
            });
        }
        if (sequence2.length !== 0) {
            sequence2.forEach( function (item, index) {
                $('#sequence2 tr:eq('+index+')').children('td:eq(1)').children('input').val(item.CMD)
                $('#sequence2 tr:eq('+index+')').children('td:eq(2)').children('input').val(item.DATA)
                $('#sequence2 tr:eq('+index+')').children('td:eq(3)').children('input').val(item.GOTO)
            });
        }
    },

    loadSlots: function (srcindex, destindex) {
        // init all checkboxes
        $("#unloadOrder1 .chk-none").click()
        $("#unloadOrder2 .chk-none").click()

        // source
        if (srcindex.reduce((pv, cv) => pv+cv, 0) === 25) {   // sum of srcindex array
            $("#unloadOrder1 .chk-all").click()
        } else if (srcindex.reduce((pv, cv) => pv+cv, 0) === 0) {
            $("#unloadOrder1 .chk-none").click()
        } else if (srcindex.reduce((pv, cv) => pv+cv, 0) === 13) {
            var notodd = false
            for (var i = 0; i < srcindex.length; i+=2) {
                if (srcindex[i] != 1) {
                    notodd = true
                    break;
                } 
            }
            if (!notodd) {
                $("#unloadOrder1 .chk-odd").click()
            } else {
                srcindex.forEach( function (item, index) {
                    if (item === 1) {
                        $("#unloadOrder1 .chk-element:eq("+index+")").click()
                    }
                })
            }
        } else {
            srcindex.forEach( function (item, index) {
                if (item === 1) {
                    $("#unloadOrder1 .chk-element:eq("+index+")").click()
                }
            })
        }
        // destination
        if (destindex.reduce((pv, cv) => pv+cv, 0) === 25) {  // sum of destindex array
            $("#unloadOrder2 .chk-all").click()
        } else if (destindex.reduce((pv, cv) => pv+cv, 0) === 0) {
            $("#unloadOrder2 .chk-none").click()
        } else if (destindex.reduce((pv, cv) => pv+cv, 0) === 13) {
            var notodd = false
            for (var i = 0; i < destindex.length; i+=2) {
                if (destindex[i] != 1) {
                    notodd = true
                    break;
                } 
            }
            if (!notodd) {
                $("#unloadOrder2 .chk-odd").click()
            } else {
                destindex.forEach( function (item, index) {
                    if (item === 1) {
                        $("#unloadOrder2 .chk-element:eq("+index+")").click()
                    }
                }) 
            }
        } else {
            destindex.forEach( function (item, index) {
                if (item === 1) {
                    $("#unloadOrder2 .chk-element:eq("+index+")").click()
                }
            })           
        }
    },
    
    saveRecipeBtnClick:function () {

        if (recipename !== "") {
            // Build up JSON
            var recipename = $('#recipeName').val()                 // recipe name
            var order = this.unloadOrder()                          // unload order (.src) and (.dest)

            // (TODO) check if box is checked
            if ($("input[name='type']").parent().hasClass('active'))
                var type = $("input[name='type']").parent('.active').children().val()      // type
            else 
                alert("Please check TYPE")

            if ($('input[name=usage1]').parent().hasClass('active') && $('input[name=usage2]').parent().hasClass('active')) {
                var usage1 = $('input[name=usage1]').parent('.active').children().val()          // usage en/disable
                var usage2 = $('input[name=usage2]').parent('.active').children().val()          // usage en/disable
            } else 
                alert("Please check USAGE")

            var sequence = this.sequence()                          // sequence 1(.seq1) and 2(.seq2)

            var recipe = {
                name:recipename,
                source:order.src,
                destination:order.dest,
                type:type,
                process1:{
                    usage:usage1,
                    sequence:sequence.seq1
                },
                process2:{
                    usage:usage2,
                    sequence:sequence.seq2
                }
            }

            // 7/12 TODO save recipe to file
            var json = this.encodeJSON("SCHD", "COMMAND", this.station_id, "SAVERECIPE", recipe, null);
            // AJAX POST
            this.ajaxCall(this.ajaxUrl, json, "saveRecipe", this.callBack);
        } else {
            alert("Please input recipe name.")
        }
    },

    // 7/12 TODO
    loadRecipeBtnClick:function () {
        $("#recipeModal").modal({show: true});

        // var json = this.encodeJSON("SCHD", "COMMAND", this.station_id, "SAVERECIPE", recipe, null);
        // AJAX POST
        // this.ajaxCall(this.ajaxUrl, json, "loadRecipe", this.callBack);
    }
});