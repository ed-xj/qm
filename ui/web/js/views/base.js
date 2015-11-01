window.BaseView = Backbone.View.extend({
    ajaxCall: function(json, msg) {
    // ajaxCall: function(json, msg, callback) {
        var that = this;
        $.ajax({
            url: "/cgi-bin/tcp_socket_client.js",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(json),
            datatype: "json",
            success: function(data) {
                console.log("AJAX POST Sucess(" + msg + ")");
                console.log(data.message);
                if (data.map === true)
                    if (data.message.length !== 25)
                        alert("Mapping Error, slot count is not correct")
                    else
                        // callback(data)
                        that.slotMapping(data.message)
            },
            error: function(error) {
                console.log("Some error in fetching the notification");
            }
        });
    }
});