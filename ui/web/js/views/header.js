window.HeaderView = Backbone.View.extend({

    initialize: function (moderator) {
        this.moderator = moderator;
        this.moderator.on('lang:change', this.onLangChange.bind(this));
    },

    activate: function() {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template({tabMapFontAwesome: this.tabMapFontAwesome}));
        return this;
    },

    events: {
        "keyup .search-query": "search",
        "keypress .search-query": "onkeypress",
        "click #logout": "logout"
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
        $('.header').hide();
        window.app.navigate("/", {trigger: true});
    },

    onLangChange: function() {
        console.log('HeaderView::onLangChange');
        this.render();
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

    tabMapFontAwesome: {
        "input"     : "fa-caret-square-o-right",
        "output"    : "fa-caret-square-o-left",
        "aligner"   : "fa-align-justify",
        "loadport"  : "fa-upload",
        "reader"    : "fa-barcode",
        "process"   : "fa-cogs",
        "recipe"    : "fa-list-ol"
    }
});
