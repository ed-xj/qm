window.BaseView = Backbone.View.extend({
    ajaxCall: function(ajaxUrl, json, msg, succCallback, errCallback) {
        $.ajax({
            url: ajaxUrl ||  "/cgi-bin/tcp_socket_client.js",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(json),
            datatype: "json",
            success: function(data) {
                console.log("AJAX POST Sucess(" + msg + ")");
                console.log(data.Message);
                if (succCallback) succCallback(data);
            },
            error: function(error) {
                console.log("AJAX ERROR, some error in fetching the notification.");
                console.log(error);
                if (errCallback) errCallback(error);
            },
            complete: function() {
                // do something after ajax call complete
            }
        });
    },

    // long polling
    systemStatus: function() { 
        var GUI_LOG_URL = "/cgi-bin/system_status.js"
        $.ajax({ url: GUI_LOG_URL, success: function(data){
            //Update your dashboard gauge
            // salesGauge.setValue(data.value);
        }, dataType: "json", complete: systemStatus, timeout: 30000 }); 
    },

    // JSON encode and decode
    encodeJSON: function(dest, type, id, cmd, param, msg) {
        return json = {
            "CmdDest":dest,
            "CmdType":type,
            "StationID":id,
            "Cmd":cmd,
            "Param":param,
            "Message":msg,
        };
    },

    // decodeJSON = function (json) {
    //     if (json.CmdDest==="SCHD") {
    //         switch (json.CmdType) {
    //             case "ERROR":
    //                 break;
    //             case "MAPPING":
    //                 break;
    //             case "STATUS":
    //                 break;
    //             case "RECIPE":
    //                 break;
    //             case "COMMAND":
    //                 break;
    //         }
    //     } else if (json.CmdDest==="UI") {
    //         switch (json.CmdType) {
    //             case "ERROR":
    //                 break;
    //             case "MAPPING":
    //                 break;
    //             case "STATUS":
    //                 break;
    //             case "RECIPE":
    //                 break;
    //             case "COMMAND":
    //                 break;
    //         }
    //     }
    // }
});