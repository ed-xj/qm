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
        "click #saveRecipe":"saveRecipeBtnCLick",     // save
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
    
    saveRecipeBtnCLick:function () {
        // Build up JSON
        // var json = {
        //         "CmdDest":"SCHD",
        //         "CmdType":"saveRecipe",
        //         "message":"",
        //         "recipe":{
        //             "xxx":"xxx" // todo
        //         }
        //     };
        var json = encodeJSON("SCHD", "COMMAND", null, "SAVERECIPE", null/*recipe*/, null);
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "saveRecipe", this.callBack);
    }
});