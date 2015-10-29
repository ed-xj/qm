window.Input1View = Backbone.View.extend({
    initialize: function (moderator) {
        this.moderator = moderator;
    },

    events: {
        "change #lang"         : "changeLang",
        "change .cassette-type": "handleCassetteChange"
    },

    changeLang: function(event) {
        window.currentLang = event.target.value;
        this.moderator.trigger('lang:change');
        this.render();
    },

    handleCassetteChange: function() {
        console.log("handleCassetteChange");
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    }
});
