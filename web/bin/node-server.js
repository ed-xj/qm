// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-server';

// Port where we'll run the websocket server
var webSocketsServerPort = 5000;
//////////////////////////////////////////////////////////////////////
// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
///////////////////////////////////////////////////////////////////////
// Log System 
var log = require('./logsystem-apache.js');
var moment = require('./moment.js');
//////////////////////////////////////////////////////////////////////
// socket as client
// check if socket is already connected. If not, create a new socket object.
// 'net' module
// https://nodejs.org/api/net.html#net_net
var net = require('net');
// give server scheduler ip address and port.
var HOST = '127.0.0.1';
var PORT = 1337;
var client = new net.Socket();
client.setEncoding('utf8');

//////////////////////////////////////////////////////////////////////
// JSON encode and decode
var util = require('../../ui/web/lib/utility.js');
/**
 * Global variables
 */
 // list of currently connected clients (users)
var clients = [ ];

var inputData = '';
var connection = null;

// date function for log
var lognow = function() {
    var d = new Date()
    d = d.getFullYear()+"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+("0"+d.getDate()).slice(-2)+" "+("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2)+":"+("0"+d.getSeconds()).slice(-2)
    return d
}
/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});
server.listen(webSocketsServerPort, function() {
    console.log(lognow() + " Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log(lognow() + ' Connection from origin ' + request.origin + '.');

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    connection = request.accept(null, request.origin);
    // wsServer.unmount()
    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection);
    // var userName = false;
    // var userColor = false;

    // start socket to SCHD
    client.connect(PORT, HOST);
    console.log(lognow() + ' Connection accepted.');
    // send back chat history
    // if (history.length > 0) {
    //     connection.sendUTF(JSON.stringify( { type: 'history', data: history} ));
    // }

    // user sent some message
    connection.on('message', function(message) {
        // console.log(message.utf8Data)
        var json_msg = JSON.parse(message.utf8Data)

        ////////////////////////////////////////////////////////////////////////////
        // Server Log
        //////////////////////////////////////                       
        var msg = "[WebSocket] Receive msg from UI. \n"    
        var now = moment();                 
        log.fileExist(now);                 
        log.appendToFile(now, msg+message.utf8Data);         
        log.checkFileCreatedTime(now);      
        ////////////////////////////////////////////////////////////////////////////
        console.log("[WebSocket] Receive msg from UI (apache server <-- UI)")
        // if (message.type === 'utf8') { // accept only text
        //     if (userName === false) { // first message sent by user is their name
        //         // remember user name
        //         userName = htmlEntities(message.utf8Data);
        //         // get random color and send it back to the user
        //         userColor = colors.shift();
        //         connection.sendUTF(JSON.stringify({ type:'color', data: userColor }));
        //         console.log((new Date()) + ' User is known as: ' + userName
        //                     + ' with ' + userColor + ' color.');

        //     } else { // log and broadcast the message
        //         console.log((new Date()) + ' Received Message from '
        //                     + userName + ': ' + message.utf8Data);
                
                // we want to keep history of all sent messages
                // var obj = {
                //     time: (new Date()).getTime(),
                //     text: htmlEntities(message.utf8Data),
                //     author: userName,
                //     color: userColor
                // };
                // history.push(obj);
                // history = history.slice(-100);

                // broadcast message to all connected clients
                // var json = JSON.stringify({ type:'message', data: obj });
                // for (var i=0; i < clients.length; i++) {
                //     clients[i].sendUTF(json);
                // }
            // }
        // }
        console.log("Connected user: "+clients.length)
        // socket to SCHD
        // send to scheduler through socket
        ////////////////////////////////////////////////////////////////////////////
        // Server Log
        //////////////////////////////////////                       
        var msg = "[Socket] Send msg to SCHD. (SCHD <-- apache server)"    
        var now = moment();                 
        log.fileExist(now);                 
        log.appendToFile(now, msg);         
        log.checkFileCreatedTime(now);      
        ////////////////////////////////////////////////////////////////////////////
        console.log(msg)
        if (client.writable)    // Reconnect to socket (apache <--> SCHD), if socket is disconnect.
            client.write(JSON.stringify(json_msg));
        else {
            // start socket to SCHD
            client.connect(PORT, HOST);
            client.write(JSON.stringify(json_msg));
        }

    });

    // user disconnected
    connection.on('close', function(connection) {
        // if (userName !== false && userColor !== false) {
        //     console.log((new Date()) + " Peer "
        //         + connection.remoteAddress + " disconnected.");
            // remove user from the list of connected clients
            clients.splice(index, 1);
            console.log("Connected users: "+clients.length)
        // }

        ////////////////////////////////////////////////////////////////////////////
        // Server Log
        ////////////////////////////////////////////////////////////////////////////                               
        var msg = "[WebSocket] UI disconnected from websocket."  
        var now = moment();                         
        log.fileExist(now);                         
        log.appendToFile(now, msg);                 
        log.checkFileCreatedTime(now);              
        ////////////////////////////////////////////////////////////////////////////
        console.log(msg)
    });


    //////////////////////////////////////////////////////////////////////
    // Socket events
    // add a data event to client side.
    // 'data' is what scheduler respond back.

    // var testdata = []    // testing push and pop
    client.on('data', function (data) {
        // parse data from scheduler
        var parseddata = JSON.parse(data);
        console.log(parseddata)
        //////////////////////////////////////
        // Server Log
        //////////////////////////////////////                       
        var msg = "[Socket] Receive msg from SCHD. (apache server <-- SCHD)"    
        var now = moment();                 
        log.fileExist(now);                 
        log.appendToFile(now, msg+JSON.stringify(parseddata));         
        log.checkFileCreatedTime(now);      
        //////////////////////////////////////
        console.log(msg)

        //////////////////////////////////////
        // Server Log
        //////////////////////////////////////                       
        var msg = "[WebSocket] Send msg to UI. (UI <-- apache server)"    
        var now = moment();                 
        log.fileExist(now);                 
        log.appendToFile(now, msg+JSON.stringify(parseddata));         
        log.checkFileCreatedTime(now);      
        //////////////////////////////////////
        console.log(msg)
        connection.sendUTF(JSON.stringify(parseddata));
        // console out, send to browser
        // console.log(JSON.stringify(parseddata));
        // close socket
        // client.end();
    });

        // socket error event
    client.on('error', function() {
        ////////////////////////////////////////////////////////////////////////////
        // Server Log                       
        //////////////////////////////////////
        var msg = "[Socket] Socket error. (apache server <-> SCHD)"    
        var now = moment();                 
        log.fileExist(now);                 
        log.appendToFile(now, msg);         
        log.checkFileCreatedTime(now);      
        ////////////////////////////////////////////////////////////////////////////
        console.log(msg)

        // JSON encode
        var json = util.encodeJSON("UI", "ERROR", null, null, null, "Socket connection ERROR");
        // console.log(JSON.stringify(json));//{"Message":"Socket connection ERROR"}));
        ////////////////////////////////////////////////////////////////////////////
        // Server Log          
        //////////////////////////////////////             
        var msg = "[WebSocket] Error msg send to UI. (UI <-- apache server)"    
        var now = moment();                 
        log.fileExist(now);                 
        log.appendToFile(now, msg+JSON.stringify(json));         
        log.checkFileCreatedTime(now);      
        ////////////////////////////////////////////////////////////////////////////     
        console.log(msg)
        connection.sendUTF(JSON.stringify(json));
    });

    // client.on('end', function () {
        // var parsedData = JSON.parse(inputChunk);
        // console.log(inputData);
        // console.log("Socket closed.")
    // });

    // add a socket close event to close connection.
    client.on('close', function() {
        ////////////////////////////////////////////////////////////////////////////
        // Server Log
        //////////////////////////////////////                       
        var msg = "[Socket] Socket Closed. (apache server <-> SCHD)"    
        var now = moment();                 
        log.fileExist(now);               
        log.appendToFile(now, msg);         
        log.checkFileCreatedTime(now);      
        ////////////////////////////////////////////////////////////////////////////
        console.log(msg)
        // close websocket.
        // connection.close();
    });

});

