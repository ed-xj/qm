window.RobotView = Backbone.View.extend({

    initialize:function (moderator) {
        console.log('Initializing Robot View');
        this.moderator = moderator;
        this.moderator.on('lang:change', this.onLangChange.bind(this));
        this.logmsg = '';
        this.templateParams = {sysmsg: this.logmsg};
        this.genLogMsg();
//        this.template = _.template(directory.utils.templateLoader.get('home'));
//        this.template = templates['Home'];
    },

    events:{
        "click #showMeBtn"     : "showMeBtnClick",
        "click #robotHelpModal": "showHelpModal"

    },

    genLogMsg: function() {
        for (var i=0; i<Math.floor((Math.random() * 1000) + 1); i++) {
            this.logmsg += ((new Date()) + ':system log messages ' + i);
            this.logmsg += '<br>';
        }
        this.templateParams = {sysmsg: this.logmsg};
    },

    activate: function() {
        this.genLogMsg();
        this.render();
    },

    onLangChange: function() {
        console.log('RobotView::onLangChange');
        this.render();
    },

    render:function () {
        this.templateParams = {sysmsg: this.logmsg};
        $(this.el).html(this.template(this.templateParams));
        return this;
    },

    showMeBtnClick:function () {
        app.headerView.search();
    },

    showHelpModal: function () {
        var frameSrc = "/ui/help/index.htm#t=Safety%2FDefinitions.htm";
        $("#myIframe").attr("src", frameSrc);
        $("#myModal").modal({show: true});
    }

});
