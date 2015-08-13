window.LoginView = Backbone.View.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
    },

    events: {
        "submit .form-signin" : "login"
    },

    login: function (event) {
        event.preventDefault();
        var username = $("#inputID").val();
        var password = $("#inputPassword").val();
        var iniPassword = window.iniCfg.userpassword[username];
        if (!iniPassword || iniPassword != password) {
            this.credentialsNotFound();
            return;
        }
        window.user = username;
        window.userRole = window.iniCfg.userrole[username];
        window.location = window.location + "#dashboard";
    },

    credentialsNotFound: function () {
        $("#warning").html("Credentials not found!");
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    }
});
