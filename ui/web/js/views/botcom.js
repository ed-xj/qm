window.BotcomView = Backbone.View.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
    },

    render: function () {
        $(this.el).html(this.template());
    }
});
