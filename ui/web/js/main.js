window.Router = Backbone.Router.extend({

    routes: {
        ""              : "login",
        "dashboard"     : "dashboard",
        "robot"         : "robot",
        "contact"       : "contact",
        "employees/:id" : "employeeDetails",
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
        "Recipe"        : "Recipe"
    },

    moderator: _.extend({}, Backbone.Events),

    initialize: function () {
    },

    darkPageWrapper: function() {
        $('#page-wrapper').css('background-color', '#222');
    },

    lightPageWrapper: function() {
        $('#page-wrapper').css('background-color', '#fff');
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
        } else {
            this.navigate("#dashboard");
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
    },

    contact: function () {
        this.header();
        this.lightPageWrapper();

        if (!this.contactView) {
            this.contactView = new ContactView();
            this.contactView.render();
        }
        $('#content').html(this.contactView.el);
        this.headerView.select('contact-menu');
    },

    employeeDetails: function (id) {
        var employee = new Employee({id: id});
        employee.fetch({
            success: function (data) {
                // Note that we could also 'recycle' the same instance of EmployeeFullView
                // instead of creating new instances
                $('#content').html(new EmployeeView({model: data}).render().el);
            }
        });
    },

    config: function () {
        this.header();
        this.lightPageWrapper();

        if (!this.configView) {
            this.configView = new ConfigView(this.moderator);
            this.configView.render();
        } else {
            this.configView.delegateEvents(); // delegate events when the view is recycled
        }
        $('#content').html(this.configView.el);
        this.headerView.select('config-menu');
    },

    botcom: function () {
        this.header();
        this.lightPageWrapper();

        if (!this.botcomView) {
            this.botcomView = new BotcomView();
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
        this.renderInput(this.Input2View, 'Input6');
    },

    Input7: function() {
        this.renderInput(this.Input2View, 'Input7');
    },

    Input8: function() {
        this.renderInput(this.Input8View, 'Input8');
    },

    renderInput: function(inputView, inputName) {
        console.log("Router calling " + inputName);
        this.header();
        if (!inputView) {
            eval("this." + inputName + "View = new " + inputName + "View();");
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
        this.headerView.select('aligner-menu');
    },

    Recipe: function () {
        this.header();
        this.lightPageWrapper();

        if (!this.recipeView) {
            this.recipeView = new RecipeView(this.moderator);
            this.recipeView.render();
        } else {
            this.recipeView.delegateEvents(); // delegate events when the view is recycled
        }
        $('#content').html(this.recipeView.el);
        this.headerView.select('recipe-menu');
    }
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
                     "RecipeView"
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
