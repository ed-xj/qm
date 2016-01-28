window.RecipeView = window.BaseView.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
        this.unloadOrder1 = 'b2t';
        this.unloadOrder2 = 'b2t';
    },

    events : {
        "click .chk-all":"chkAllCLick",               // check all
        "click .chk-none":"chkNoneCLick",             // check none
        "click .chk-element":"chkElemCLick",          // check element
        "click #saveRecipe":"saveRecipeBtnCLick",     // save recipe
        "click #loadRecipe":"loadRecipeBtnCLick",     // load recipe
        "click input[name=unloadOrder1]": "updateUnloadOrder1",
        "click input[name=unloadOrder2]": "updateUnloadOrder2"
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    },

    chkAllCLick:function (e) {
        var chkGroup = $(e.currentTarget).parents(".chk-group:first");
        chkGroup.find(".chk-element").prop("checked", "checked");
        chkGroup.find(".chk-none").prop("checked", "");
        chkGroup.find(".chk-all").prop("checked", "checked");
    },

    chkNoneCLick:function (e) {
        var chkGroup = $(e.currentTarget).parents(".chk-group:first");
        chkGroup.find(".chk-element").prop("checked", "");
        chkGroup.find(".chk-all").prop("checked", "");
        chkGroup.find(".chk-none").prop("checked", "checked");
    },

    chkElemCLick:function (e) {
        var chkGroup = $(e.currentTarget).parents(".chk-group:first");
        if (chkGroup.find(".chk-element:checked").length == chkGroup.find(".chk-element").length) {
            chkGroup.find(".chk-all").prop("checked", "checked");
            chkGroup.find(".chk-none").prop("checked", "");
        } else if (chkGroup.find(".chk-element:checked").length == 0) {
            chkGroup.find(".chk-none").prop("checked", "checked");
            chkGroup.find(".chk-all").prop("checked", "");
        } else {
            chkGroup.find(".chk-all").prop("checked", "");
            chkGroup.find(".chk-none").prop("checked", "");
        }
    },

    reverseSlots: function(id, order) {
        var selector = 'div#' + id;
        var elem = this.$(selector);
        var checks = elem.children('div.checkbox').get();
        var all = checks.shift();
        var none = checks.shift();
        elem.append([all, none].concat(checks.reverse()));
    },

    updateUnloadOrder1: function(e) {
        var val = e.currentTarget.value;
        switch (val) {
            case '1':
                if (this.unloadOrder1 == 't2b') {
                    this.reverseSlots("unloadOrder1", 't2b');
                    this.unloadOrder1 = 'b2t';
                }
                break;
            case '2':
                if (this.unloadOrder1 == 'b2t') {
                    this.reverseSlots("unloadOrder1", 'b2t');
                    this.unloadOrder1 = 't2b';
                }
                break
        }
    },

    updateUnloadOrder2: function(e) {
        var val = e.currentTarget.value;
        switch (val) {
            case '1':
                if (this.unloadOrder2 == 't2b') {
                    this.reverseSlots("unloadOrder2", 't2b');
                    this.unloadOrder2 = 'b2t';
                }
                break;
            case '2':
                if (this.unloadOrder2 == 'b2t') {
                    this.reverseSlots("unloadOrder2", 'b2t');
                    this.unloadOrder2 = 't2b';
                }
                break
        }
    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",

    callBack: function(data) {
        alert("Save succeed.");
    },

    unloadOrder: function () {
        var element1 = new Array()
        var element2 = new Array()
        if ($('#unloadOrder1 .chk-all').is(':checked')) {
            element1 = Array.apply(null, Array(25)).map(Number.prototype.valueOf,1);
        } else if ($('#unloadOrder1 .chk-none').is(':checked')){
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
            source:null,
            index:element1
        }

        if ($('#unloadOrder2 .chk-all').is(':checked')) {
            element2 = Array.apply(null, Array(25)).map(Number.prototype.valueOf,1);
        } else if ($('#unloadOrder2 .chk-none').is(':checked')){
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
            source:null,
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
                    DATA:$(this).children('td:eq(2)').children().val()
                    //GOTO: $(this).children('td:eq(3)').children().val()
                })
            }
        })
        $('#sequence2 tr').each( function () {
            if ( $(this).children('td:eq(1)').children().val() !== "") {
                sequence2.push({
                    CMD:$(this).children('td:eq(1)').children().val(),
                    DATA:$(this).children('td:eq(2)').children().val()
                    //GOTO: $(this).children('td:eq(3)').children().val()
                })
            }
        })

        return {
            seq1:sequence1,
            seq2:sequence2
        }
    },
    
    // TODO
    saveRecipeBtnCLick:function () {
        // Build up JSON
        var recipename = $('#recipeName').val()                 // recipe name
        var order = this.unloadOrder()                          // unload order (.src) and (.dest)

        // (TODO) check if box is checked
        // if ($('input[name=type]').is(':checked'))
        if ($('input[name=type]').hasClass('active'))
            var type = $('input[name=type]:checked').val()      // type
        else 
            alert("Please check TYPE")

        if ($('input[name=usage1]').is(':checked') && $('input[name=usage2]').is(':checked')) {
            var usage1 = $('input[name=usage1]').val()          // usage en/disable
            var usage2 = $('input[name=usage2]').val()          // usage en/disable
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

        var json = encodeJSON("SCHD", "COMMAND", null, "SAVERECIPE", recipe, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "saveRecipe", this.callBack);
    },

    // TODO
    loadRecipeBtnCLick:function () {
        // load up recipe
        console.log("load recipe btn pressed");
    }
});