window.RecipeView = window.BaseView.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
    },

    events : {
        "click #save":"saveBtnCLick",               // read it
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    },

    ajaxUrl: "/cgi-bin/tcp_socket_client.js",

    callBack: function(data) {
        alert("Save succeed.");
    },
    
    saveBtnCLick:function () {
        // Build up JSON
        var json = {
                "CmdDest":"SCHD",
                "CmdType":"saveRecipe",
                "message":"",
                "recipe":{
                    "xxx":"xxx" // todo
                }
            };
        // AJAX POST
        this.ajaxCall(this.ajaxUrl, json, "saveRecipe", this.callBack);
    }
});