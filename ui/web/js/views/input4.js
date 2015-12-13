window.Input4View = window.InputBaseView.extend({
    initialize: function (moderator) {
        window.Input4View.__super__.initialize.apply(this, moderator);
        this.model = new window.InputModel();
        this.model.set('viewName', "Input4");
    },

    events : {
        // "change #lang": "changeLang",
        "change #waferType":"handleWaferTypeChange",      // change wafer type
        "change .cassette-type":"handleCassetteChange",   // casette change
        "click #openFoup":"openFoupBtnCLick",             // open foup
        "click #closeFoup":"closeFoupBtnCLick",           // close foup
        "click #loadCasette":"loadCasetteBtnCLick",       // load casette
        "click #unloadCasette":"unloadCasetteBtnCLick",   // unload casette
        "click #openDoor":"openDoorBtnCLick",             // open door
        "click #closeDoor":"closeDoorBtnCLick",           // close door
        "click #restoreData":"restoreDataBtnCLick",       // restore data
        "click #updateId":"updateIdBtnCLick",             // update ID
        "click #getWaferType":"getWaferTypeBtnCLick",     // get standard
        "click #putWaferType":"putWaferTypeBtnCLick",     // put standard
        "click #mapWaferType":"mapWaferTypeBtnCLick",     // map standard
        "dblclick #slots tr > td":"slotIdDblCkick",       // slot id double click
        "click #slots tr > td":"slotClick",               // slot click
        "focusout .wafer-id-input":"handleWaferIdChange"  // wafer id change
    }
});