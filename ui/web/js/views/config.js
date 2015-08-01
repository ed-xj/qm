window.ConfigView = Backbone.View.extend({
    initialize: function () {
    },

    events : {
        "change #lang": "changeLang",
    },

    changeLang: function(event) {
        window.currentLang = event.target.value;
    },

    render: function () {
        $(this.el).html(this.template());
    },
});
