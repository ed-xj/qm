window.BaseView = Backbone.View.extend({

    initialize:function (moderator) {
        this.moderator = moderator;
        // this.moderator.on('sysmsg:change', this.onSysMsgChange.bind(this));
    },

    ajaxCall: function(ajaxUrl, json, msg, succCallback, errCallback) {
        // Check tool status, if error or running, stop sending ws
        // if ($("#statusBar>.btn[value='3']").css('opacity') == 1.0) {
        //     alert("ERROR!")
        //     return;
        // }
        // if ($("#statusBar>.btn[value='1']").css('opacity') == 1.0) {
        //     alert("Tool is still running, please wait.")
        //     return;
        // }
        ///////////////////////////////////////////////////////////////////////////////////
        // AJAX 
        // $.ajax({
        //     url: ajaxUrl ||  "/cgi-bin/tcp_socket_client.js",
        //     type: "POST",
        //     contentType: "application/json",
        //     data: JSON.stringify(json),
        //     datatype: "json",
        //     success: function(data) {
        //         console.log("AJAX POST Sucess(" + msg + ")");
        //         console.log(data.Message);
        //         if (succCallback) succCallback(data);
        //     },
        //     error: function(error) {
        //         console.log("AJAX ERROR, some error in fetching the notification.");
        //         console.log(error);
        //         if (errCallback) errCallback(error);
        //     },
        //     complete: function() {
        //         // do something after ajax call complete
        //     }
        // });
        // AJAX
        /////////////////////////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////////////////////////////
        // WebSocket
        // var connection = false
        // // if user is running mozilla then use it's built-in WebSocket
        // window.WebSocket = window.WebSocket || window.MozWebSocket;

        // // // if browser doesn't support WebSocket, just show some notification and exit
        // if (!window.WebSocket) {
        //     console.log('Sorry, but your browser doesn support WebSockets.')
        //     return;
        // }
        var that = this
        // Besure that websocket is on, otherwise it will fail to reconnect.
        var connection = this.moderator.get("websocket")

        // send the message as an ordinary text
        if (connection.readyState === connection.OPEN) {
            connection.send(JSON.stringify(json));
            console.log("Websocket message sent.")
        }
        
        // WebSocket open event listener
        connection.onopen = function () {
            console.log("Websocket open.")
            connection.send(JSON.stringify(json));
        };

        // WebSocket error event listener
        connection.onerror = function (error) {
            alert("Websocket ERROR. Please RELOAD this page.")
            // just in there were some problems with conenction...
            console.log("Websocket error. " + error)
            this.moderator.set("websocket", false);
            $("#statusBar>.btn[value='3']").css('opacity', '1.0');
            $("#statusBar>.btn[value='2']").css('opacity', '0.5');
            $("#statusBar>.btn[value='1']").css('opacity', '0.5');
            alert("ERROR! Websocket ERROR!")
            that.moderator.set("sysStatus","ERROR")
            if (errCallback) errCallback(error);
        };

        // WebSocket message event listener
        // most important part - incoming messages
        connection.onmessage = function (message) {
            var msg = JSON.parse(message.data)
            console.log("websocket receive msg. " + JSON.stringify(msg))
            that.decodeJSON(msg)
            if (succCallback) succCallback(msg);
        };

        // WebSocket message event listener
        // most important part - incoming messages
        connection.onclose = function () {
            alert("Websocket Close. Please RELOAD this page.")
            this.moderator.set("websocket", false)
            $("#statusBar>.btn[value='3']").css('opacity', '1.0');
            $("#statusBar>.btn[value='2']").css('opacity', '0.5');
            $("#statusBar>.btn[value='1']").css('opacity', '0.5'); 
            alert("ERROR! Websocket closing.")
            that.moderator.set("sysStatus","ERROR")
            console.log("Websocket close.")
        };


        // setInterval(function() {
        //     if (connection.readyState !== 1) {
        //         console.log("Unable to comminucate with the WebSocket server.");
        //     }
        // }, 3000);
        // WebSocket
        //////////////////////////////////////////////////////////////////////////////
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

    decodeJSON: function (json) {
        if (json.CmdDest==="UI") {
            switch (json.CmdType) {
                case "ERROR":
                    $("#statusBar>.btn[value='3']").css('opacity', '1.0');
                    $("#statusBar>.btn[value='2']").css('opacity', '0.5');
                    $("#statusBar>.btn[value='1']").css('opacity', '0.5'); 
                    this.moderator.set("sysStatus","ERROR")
                    alert("ERROR! " + json.Message)
                    break;
                case "MAPPING":
                    break;
                case "STATUS":
                    var error = $("#statusBar>.btn[value='3']")
                    var idle = $("#statusBar>.btn[value='2']")
                    var running = $("#statusBar>.btn[value='1']")

                    if (json.Cmd === "3") {
                        error.css('opacity', '1.0');
                        idle.css('opacity', '0.5');
                        running.css('opacity', '0.5');
                        alert("ERROR!")
                        this.moderator.set("sysStatus","ERROR")
                    } else if (json.Cmd === "2") {
                        error.css('opacity', '0.5');
                        idle.css('opacity', '1.0');
                        running.css('opacity', '0.5');
                        this.moderator.set("sysStatus","Idle")
                    } else {
                        error.css('opacity', '0.5');
                        idle.css('opacity', '0.5');
                        running.css('opacity', '1.0');
                        this.moderator.set("sysStatus","Running")
                    }
                    break;
                case "RECIPE":
                    this.moderator.set("recipe", json.Param)
                    break;
                case "COMMAND":
                    break;
                case "UPDATE":
                    // TODO
                    var current = Backbone.history.fragment
                    console.log("Current page: "+ current)
                    if (json.StationID !== current) {
                        switch (json.StationID) {
                            case "dashboard":
                                this.moderator.set("sysMsg", json)
                                this.moderator.trigger('sysmsg:change');
                                break;
                            case "robot":
                                this.moderator.set("robotMsg",json)
                                this.moderator.trigger('robotmsg:change');
                                break;
                            case "config":
                                this.moderator.set("secsgemMsg",json)
                                this.moderator.trigger('secsgemmsg:change');
                                break;
                        }
                    }
                    break;
            }
        };
    },

    // TODO
    logtpl: function(data) {
        var arrow = " >> "
        if (data.CmdDest === "UI") {
            arrow = " << "
        }
        // show message in Message section, and trigger "change" event
        var d = new Date()
        d = d.getFullYear()+"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+("0"+d.getDate()).slice(-2)+" "+("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2)+":"+("0"+d.getSeconds()).slice(-2)
        $("code[name='sysmsg']").append(d + arrow + data.Message + "<br>").trigger("change");
    }
});