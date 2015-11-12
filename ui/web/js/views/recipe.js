window.RecipeView = window.BaseView.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
    },

    events : {
        // "change #lang": "changeLang",
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    }
});