window.Input4View = window.InputBaseView.extend({
    initialize: function (moderator) {
        window.Input4View.__super__.initialize.apply(this, moderator);
        this.model = new window.InputModel();
        this.model.set('viewName', "Input4");
    },

    events : {
        // "change #lang": "changeLang",
        "change .cassette-type": "handleCassetteChange",
        "click #openFoup":"openFoupBtnCLick",           // open foup
        "click #closeFoup":"closeFoupBtnCLick",         // close foup
        "click #loadCasette":"loadCasetteBtnCLick",     // load casette
        "click #unloadCasette":"unloadCasetteBtnCLick", // unload casette
        "click #openDoor":"openDoorBtnCLick",           // open door
        "click #closeDoor":"closeDoorBtnCLick",         // close door
        "click #restoreData":"restoreDataBtnCLick",     // restore data
        "click #getStandard":"getStandardBtnCLick",     // get standard
        "click #putStandard":"putStandardBtnCLick",     // put standard
        "click #mapStandard":"mapStandardBtnCLick",     // map standard
        "click #getWrapBelow":"getWrapBelowBtnCLick",   // get wrap below
        "click #putWrapBelow":"putWrapBelowBtnCLick",   // put wrap below
        "click #mapWrapBelow":"mapWrapBelowBtnCLick",   // map wrap below
        "click #getWrapAbove":"getWrapAboveBtnCLick",   // get wrap above
        "click #putWrapAbove":"putWrapAboveBtnCLick",   // put wrap above
        "click #mapWrapAbove":"mapWrapAboveBtnCLick"    // map wrap above
    }
});