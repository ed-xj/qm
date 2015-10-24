window.Input1View = Backbone.View.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
    },

    events : {
        "change #lang": "changeLang"
    },

    changeLang: function(event) {
        window.currentLang = event.target.value;
        this.moderator.trigger('lang:change');
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
    }
});
