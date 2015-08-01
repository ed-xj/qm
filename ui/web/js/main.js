window.Router = Backbone.Router.extend({

    routes: {
        ""              : "dashboard",
        "dashboard"     : "dashboard",
        "robot"         : "robot",
        "contact"       : "contact",
        "employees/:id" : "employeeDetails",
        "config"        : "config",
        "botcom"        : "botcom",
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.render().el);

        // Close the search dropdown on click anywhere in the UI
        $('body').click(function () {
            $('.dropdown').removeClass("open");
        });
    },

    dashboard: function () {
        // Since the home view never changes, we instantiate it and render it only once
        if (!this.dashboardView) {
            this.dashboardView = new DashboardView();
            this.dashboardView.render();
        } else {
            this.dashboardView.activate();
            this.dashboardView.delegateEvents(); // delegate events when the view is recycled
        }
        $("#content").html(this.dashboardView.el);
        this.headerView.select('dashboard-menu');
    },

    robot: function () {
        if (!this.robotView) {
            this.robotView = new RobotView();
            this.robotView.render();
        } else {
            this.robotView.activate();
            this.robotView.delegateEvents(); // delegate events when the view is recycled
        }
        $("#content").html(this.robotView.el);
        this.headerView.select('robot-menu');
    },

    contact: function () {
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
        if (!this.configView) {
            this.configView = new ConfigView();
            this.configView.render();
        }
        $('#content').html(this.configView.el);
        this.headerView.select('config-menu');
    },

    botcom: function () {
        if (!this.botcomView) {
            this.botcomView = new BotcomView();
            this.botcomView.render();
        }
            $('#content').html(this.botcomView.el);
            this.headerView.select('botcom-menu');
    },
});

templateLoader.load(["DashboardView", "RobotView", "ContactView", "HeaderView", "EmployeeView", "EmployeeSummaryView", "EmployeeListItemView", "ConfigView", "BotcomView"],
    function () {
        app = new Router();
        Backbone.history.start();
    });
