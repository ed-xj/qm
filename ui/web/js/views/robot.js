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

    disableControls: function(role) {
        if (role && role.toLowerCase() === 'operator') {
            $(this.el).find('input, button').each(function(index){
                $(this).prop('disabled', true);
                // console.log( index + ": " + $( this ).text() );
            });
//            $(this.el).find('button').each(function(index){
//                $(this).prop('disabled', true);
//                // console.log( index + ": " + $( this ).text() );
//            });
        }
    },

    render:function () {
        this.templateParams = {sysmsg: this.logmsg};
        $(this.el).html(this.template(this.templateParams));
        this.disableControls(localStorage.userRole);
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
