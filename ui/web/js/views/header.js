window.HeaderView = Backbone.View.extend({

    initialize: function (moderator) {
        this.moderator = moderator;
        this.moderator.on('lang:change', this.onLangChange.bind(this));
        this.moderator.on('robotmsg:msg', this.onRobotMsgChange.bind(this));
        this.moderator.on('sysmsg:msg', this.onSysMsgChange.bind(this));
        this.moderator.on('secsgemmsg:msg', this.onSecsgemMsgChange.bind(this));
        this.moderator.on('recipe:load', this.onRecipeLoad.bind(this));
    },

    activate: function() {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template({tabMapFontAwesome: this.tabMapFontAwesome}));
        return this;
    },

    events: {
        "keyup .search-query"   : "search",
        "keypress .search-query": "onkeypress",
        "click #logout"         : "logout",
        "click #help_btn"       : "showHelpModal",
        "load body"             : "showClock"
    },

    search: function () {
        var key = $('#searchText').val();
        console.log('search ' + key);
        this.searchResults.findByName(key);
        setTimeout(function () {
            $('.dropdown').addClass('open');
        });
    },

    logout: function() {
        localStorage.setItem("user", "");
        localStorage.setItem("userRole", "");
        $("#statusBar[for='lighttower']").hide();
        $('.header').hide();
        window.app.navigate("/", {trigger: true});
    },

    // global event listener
    onLangChange: function() {
        console.log('HeaderView::onLangChange');
        this.render();
    },
    onRobotMsgChange: function() {
        console.log('HeaderView::onRobotMsgChange');
    },    
    onSecsgemMsgChange: function() {
        console.log('HeaderView::onSecsgemMsgChange');
    },
    onSysMsgChange: function() {
        console.log('HeaderView::onSysMsgChange');
    },
    onRecipeLoad: function() {
        console.log('HeaderView::onRecipeLoad');
    },

    onkeypress: function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    },

    select: function(menuItem) {
        $('.nav li').removeClass('active');
        $('.' + menuItem).addClass('active');
    },

    showHelpModal: function () {
        var frameSrc = "/ui/help/index.htm#t=Cover.htm";
        $("#helpIframe").attr("src", frameSrc);
        $("#helpModal").modal({show: true});
    },

    showClock: function () {
        checkTime = function (i) {
            if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
            return i;
        }

        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        m = checkTime(m);
        s = checkTime(s);
        $('clock').innerHTML =
        h + ":" + m + ":" + s;
        var t = setTimeout(startTime, 500);
    },

    tabMapFontAwesome: {
        "input"     : "fa-caret-square-o-right",
        "output"    : "fa-caret-square-o-left",
        "aligner"   : "fa-align-justify",
        "loadport"  : "fa-upload",
        "reader"    : "fa-barcode",
        "process"   : "fa-cogs",
        "recipe"    : "fa-list-ol",
        "transfer"  : "fa-exchange",
        "packer"    : "fa-stack-overflow",
        "loadport"  : "fa-stack-overflow"
        // "log"       : "fa-file-text-o"
    }
});
