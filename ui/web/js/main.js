window.Router = Backbone.Router.extend({

    routes: {
        ""              : "login",
        "dashboard"     : "dashboard",
        "robot"         : "robot",
        "contact"       : "contact",
        "employees/:id" : "employeeDetails",
        "config"        : "config",
        "botcom"        : "botcom"
    },

    moderator: _.extend({}, Backbone.Events),

    initialize: function () {
    },

    header: function () {
        if (!this.headerView) {
            this.headerView = new HeaderView(this.moderator);
            $('.header').html(this.headerView.render().el);
        }
    },

    login: function () {
        this.loginView = new LoginView(this.moderator);
        $("#content").html(this.loginView.render().el);
    },

    dashboard: function () {
        this.header();
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
        if (!this.botcomView) {
            this.botcomView = new BotcomView();
            this.botcomView.render();
        }
            $('#content').html(this.botcomView.el);
            this.headerView.select('botcom-menu');
    }
});

templateLoader.load(["DashboardView", "RobotView", "ContactView", "HeaderView", "EmployeeView", "EmployeeSummaryView", "EmployeeListItemView", "ConfigView", "BotcomView", "LoginView"],
    function () {
        $.get('/cgi-bin/get-config.js', function(cfg) {
            window.iniCfg = cfg;
            console.log('config data json:'+JSON.stringify(cfg));
            app = new Router();
            Backbone.history.start();
        }, 'json');
    });
