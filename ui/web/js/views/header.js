window.HeaderView = Backbone.View.extend({

    initialize: function (moderator) {
        this.moderator = moderator;
        this.moderator.on('lang:change', this.onLangChange.bind(this));
        this.searchResults = new EmployeeCollection();
        this.searchresultsView = new EmployeeListView({model: this.searchResults, className: 'dropdown-menu'});
    },

    render: function () {
        $(this.el).html(this.template());
        $('.navbar-search', this.el).append(this.searchresultsView.render().el);
        return this;
    },

    events: {
        "keyup .search-query": "search",
        "keypress .search-query": "onkeypress"
    },

    search: function () {
        var key = $('#searchText').val();
        console.log('search ' + key);
        this.searchResults.findByName(key);
        setTimeout(function () {
            $('.dropdown').addClass('open');
        });
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
    }

});
