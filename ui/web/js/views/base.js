window.BaseView = Backbone.View.extend({
    // ajaxCall: function(json, msg) {
    ajaxCall: function(ajaxUrl, json, msg, succCallback, errCallback) {
        $.ajax({
            url: "/cgi-bin/tcp_socket_client.js",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(json),
            datatype: "json",
            success: function(data) {
                console.log("AJAX POST Sucess(" + msg + ")");
                console.log(data.message);
                if (succCallback) succCallback(data);
            },
            error: function(error) {
                console.log("Some error in fetching the notification");
                if (errCallback) errCallback(error);
            }
        });
    }
});