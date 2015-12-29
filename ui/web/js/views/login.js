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
            localStorage.setItem("user", "");
            localStorage.setItem("userRole", "");
            return;
        }

        localStorage.setItem("user", username);
        localStorage.setItem("userRole", window.iniCfg.userrole[username]);
        $('#statusBar').show();
        window.app.navigate("#dashboard", {trigger: true});
    },

    credentialsNotFound: function () {
        $("#warning").html("Credentials not found!");
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    }
});
