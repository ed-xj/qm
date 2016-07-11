window.Router = Backbone.Router.extend({

    routes: {
        ""              : "login",
        "dashboard"     : "dashboard",
        "robot"         : "robot",
        "config"        : "config",
        "botcom"        : "botcom",
        "Input1"        : "Input1",
        "Input2"        : "Input2",
        "Input3"        : "Input3",
        "Input4"        : "Input4",
        "Input5"        : "Input5",
        "Input6"        : "Input6",
        "Input7"        : "Input7",
        "Input8"        : "Input8",
        "Aligner"       : "Aligner",
        "Recipe"        : "Recipe",
        "Transfer"      : "Transfer",
        "Packer"        : "Packer",
        "Loadport"      : "Loadport",
        "Log"           : "Log",
        "*path"         : "handleDefaultRoute"
    },

    moderator: _.extend(new systemInfo(), Backbone.Events),

    initialize: function () {
        ///////////////////////////////
        // uncomment when Ui is done //
        ///////////////////////////////
        // $(window).bind("beforeunload", function() {
        //     var message = 'Important: You are leaving this page.';
        //     // if (typeof event == 'undefined') {
        //     //     event = window.event;
        //     // }
        //     if (event) {
        //         event.returnValue = message;
        //     }
        //     return message;
        // });

        // $(window).unload( function () {
        //     var json = {
        //          "CmdDest":"APACHE",
        //          "CmdType":"COMMAND",
        //          "StationID":null,
        //          "Cmd":"LOG",
        //          "Param":null,
        //          "Message":"client UI unload."
        //         };

        //     $.ajax({
        //         url: "/cgi-bin/tcp_socket_client.js",
        //         type: "POST",
        //         contentType: "application/json",
        //         data: JSON.stringify(json),
        //         datatype: "json",
        //         async:false
        //     });
        //     console.log("Bye!")
        // })

        // /////////////////////////////////////////////////////////////////////////////////////
        // // WebSocket
        // // if user is running mozilla then use it's built-in WebSocket
        // window.WebSocket = window.WebSocket || window.MozWebSocket;

        // // if browser doesn't support WebSocket, just show some notification and exit
        // if (!window.WebSocket) {
        //     console.log('Sorry, but your browser doesn support WebSockets.')
        //     return;
        // }

        // // open connection
        // var connection = new WebSocket('ws://localhost:5000');
        // // WebSocket
        // /////////////////////////////////////////////////////////////////////////////////////
    },

    darkPageWrapper: function() {
        $('#page-wrapper').css('background-color', '#222');
    },

    lightPageWrapper: function() {
        $('#page-wrapper').css('background-color', '#fff');
    },

    // Route to login when nothing in the path match our routes
    handleDefaultRoute: function() {
        this.login();
    },

    header: function () {
        if (!this.headerView) {
            this.headerView = new HeaderView(this.moderator);
            $('.header').html(this.headerView.render().el);
        } else {
            $('.header').show();
            this.headerView.activate();
            this.headerView.delegateEvents();
        }
    },

    login: function () {
        this.darkPageWrapper();
        if (((localStorage.user === undefined) || (localStorage.user === '')) &&
            ((localStorage.userRole === undefined) || (localStorage.userRole === ''))) {
            this.loginView = new LoginView(this.moderator);
            $("#content").html(this.loginView.render().el);
             $('#statusBar').hide();
        } else {
            this.navigate("#dashboard", {trigger: true});
            $('#statusBar').show();
        }
    },

    dashboard: function () {
        this.header();
        this.lightPageWrapper();

        // Since the home view never changes, we instantiate it and render it only once
        if (!this.dashboardView) {
            this.dashboardView = new DashboardView(this.moderator);
            this.dashboardView.render();
        } else {
            this.dashboardView.activate();
            this.dashboardView.delegateEvents(); // delegate events when the view is recycled
        }
        $("#content").html(this.dashboardView.el);
        this.headerView.select('dashboard-menu');
        this.dashboardView.subRender()
    },

    robot: function () {
        this.header();
        this.lightPageWrapper();

        if (!this.robotView) {
            this.robotView = new RobotView(this.moderator);
            this.robotView.render();
        } else {
            this.robotView.activate();
            this.robotView.delegateEvents(); // delegate events when the view is recycled
        }
        $("#content").html(this.robotView.el);
        this.headerView.select('robot-menu');
        this.robotView.subRender()
    },

    config: function () {
        this.header();
        this.lightPageWrapper();

        if (!this.configView) {
            this.configView = new ConfigView(this.moderator);
            this.configView.render();
        } else {
            this.configView.activate();
            this.configView.delegateEvents(); // delegate events when the view is recycled
        }
        $('#content').html(this.configView.el);
        this.headerView.select('config-menu');
        this.configView.subRender()
    },

    botcom: function () {
        this.header();
        this.lightPageWrapper();

        if (!this.botcomView) {
            this.botcomView = new BotcomView(this.moderator);
            this.botcomView.render();
        } else {
            this.botcomView.delegateEvents();
        }
        $('#content').html(this.botcomView.el);
        this.headerView.select('botcom-menu');
    },

    Input1: function() {
        this.renderInput(this.Input1View, 'Input1');
    },

    Input2: function() {
        this.renderInput(this.Input2View, 'Input2');
    },

    Input3: function() {
        this.renderInput(this.Input3View, 'Input3');
    },

    Input4: function() {
        this.renderInput(this.Input4View, 'Input4');
    },

    Input5: function() {
        this.renderInput(this.Input5View, 'Input5');
    },

    Input6: function() {
        this.renderInput(this.Input6View, 'Input6');
    },

    Input7: function() {
        this.renderInput(this.Input7View, 'Input7');
    },

    Input8: function() {
        this.renderInput(this.Input8View, 'Input8');
    },

    renderInput: function(inputView, inputName) {
        console.log("Router calling " + inputName);
        this.header();
        this.lightPageWrapper();

        if (!inputView) {
            eval("this." + inputName + "View = new " + inputName + "View(this.moderator);");
            eval("inputView = this." + inputName + "View;");
            eval("this." + inputName + "View.render();");
        } else {
            inputView.delegateEvents();
        }
        $('#content').html(inputView.el);
        this.headerView.select(inputName + '-menu');
    },

    Aligner: function () {
        this.header();
        this.lightPageWrapper();

        if (!this.alignerView) {
            this.alignerView = new AlignerView(this.moderator);
            this.alignerView.render();
        } else {
            this.alignerView.delegateEvents(); // delegate events when the view is recycled
        }
        $('#content').html(this.alignerView.el);
        this.headerView.select('Aligner-menu');
    },

    Recipe: function () {
        this.header();
        this.lightPageWrapper();

        if (!this.recipeView) {
            this.recipeView = new RecipeView(this.moderator);
            this.recipeView.render();
        } else {
            this.recipeView.activate();
            this.recipeView.delegateEvents(); // delegate events when the view is recycled
        }
        $('#content').html(this.recipeView.el);
        this.headerView.select('Recipe-menu');
    },

    Transfer: function() {
        this.header();
        this.lightPageWrapper();

        if (!this.transferView) {
            this.transferView = new TransferView(this.moderator);
            this.transferView.render();
        } else {
            this.transferView.delegateEvents();
        }
        $('#content').html(this.transferView.el);
        this.headerView.select('Transfer-menu');
    },

    Packer: function() {
        this.renderInput(this.PackerView, 'Packer');
    },

    Loadport: function () {
        this.header();
        this.lightPageWrapper();

        if (!this.loadportView) {
            this.loadportView = new LoadportView(this.moderator);
            this.loadportView.render();
        } else {
            this.loadportView.activate();
            this.loadportView.delegateEvents(); // delegate events when the view is recycled
        }
        $("#content").html(this.loadportView.el);
        this.headerView.select('Loadport-menu');
    },

    Log: function () {
        this.header();
        this.lightPageWrapper();

        if (!this.logView) {
            this.logView = new LogView(this.moderator);
            this.logView.render();
        } else {
            this.logView.activate();
            this.logView.delegateEvents(); // delegate events when the view is recycled
        }
        $('#content').html(this.logView.el);
        this.headerView.select('log-menu');
    },
});

templateLoader.load(["DashboardView",
                     "RobotView",
                     "ContactView",
                     "HeaderView",
                     "ConfigView",
                     "BotcomView",
                     "LoginView",
                     "Input1View",
                     "Input2View",
                     "Input3View",
                     "Input4View",
                     "Input5View",
                     "Input6View",
                     "Input7View",
                     "Input8View",
                     "AlignerView",
                     "RecipeView",
                     "TransferView",
                     "PackerView",
                     "LoadportView",
                     "LogView"
                    ], function () {
                        // load the server side configuration to drive the UI rendering
                        $.get('/cgi-bin/get-config.js', function(cfg) {
                            window.iniCfg = cfg;
                            console.log('config data json:'+JSON.stringify(cfg));
                            window.app = new Router();
                            Backbone.history.start();
                        }, 'json');
                    }
);
