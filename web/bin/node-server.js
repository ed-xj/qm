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
const moment = require('./moment.js');
//////////////////////////////////////////////////////////////////////
// socket as client
// check if socket is already connected. If not, create a new socket object.
// 'net' module
// https://nodejs.org/api/net.html#net_net
var net = require('net');
// give server scheduler ip address and port.
const HOST = '127.0.0.1';
const PORT = 1337;
var client = new net.Socket();
client.setEncoding('utf8');

//////////////////////////////////////////////////////////////////////
// JSON encode and decode
var util = require('../../web/bin/utility.js');

/**
 * Global variables
 */
 // list of currently connected clients (users)
var clients = [];

var inputData = '';
var connection = null;

// date function for log
var lognow = function() {
    var d = new Date()
    d = d.getFullYear()+"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+("0"+d.getDate()).slice(-2)+" "+("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2)+":"+("0"+d.getSeconds()).slice(-2)+" "
    return d
}
/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server, not HTTP server
});
server.listen(webSocketsServerPort, function() {
    console.log(lognow() + "Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server,
    // You should not use autoAcceptConnections for production 
    // applications, as it defeats all standard cross-origin protection 
    // facilities built into the protocol and the browser.  You should 
    // *always* verify the connection's origin and decide whether or not 
    // to accept it. 
    autoAcceptConnections: false
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    if (request.origin !== "http://localhost") {
        // Make sure we only accept requests from an allowed origin 
        request.reject();
        console.log(lognow() + 'Connection from origin ' + request.origin + ' rejected.');
        return;
    }
    else {
        // console.log(request)
        console.log(lognow() + 'Connection from origin ' + request.origin + '.');
    }   
    

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    connection = request.accept("qm-tool-protocol", request.origin);
    // wsServer.unmount()
    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection)-1;
    // var userName = false;
    // var userColor = false;

    // start socket to SCHD
    client.connect(PORT, HOST);
    console.log(lognow() + 'Connection accepted.');
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
        var msg = "[WebSocket] Receive msg from UI (apache server <-- UI)\n"    
        var now = moment();                 
        log.fileExist(now);                 
        log.appendToFile(now, msg+message.utf8Data);         
        log.checkFileCreatedTime(now);      
        ////////////////////////////////////////////////////////////////////////////
        console.log(lognow() + msg)

        ///////////////////////////////////////////////////////////////////////////
        // get log file directory
        util.decodeJSON(json_msg, connection)
        
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
        console.log(lognow() + msg)

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
        console.log(lognow() + msg)
    });

    
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
    console.log(lognow() + msg)

    //////////////////////////////////////
    // Server Log
    //////////////////////////////////////                       
    var msg = "[WebSocket] Send msg to UI. (UI <-- apache server)"    
    var now = moment();                 
    log.fileExist(now);                 
    log.appendToFile(now, msg+JSON.stringify(parseddata));
    log.checkFileCreatedTime(now);      
    //////////////////////////////////////
    console.log(lognow() +msg)
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
    console.log(lognow() +msg)

    // JSON encode
    var json = util.encodeJSON("UI", "ERROR", null, null, null, "Socket connection ERROR");
    ////////////////////////////////////////////////////////////////////////////
    // Server Log          
    //////////////////////////////////////             
    var msg = "[WebSocket] Error msg send to UI. (UI <-- apache server)"    
    var now = moment();                 
    log.fileExist(now);                 
    log.appendToFile(now, msg+JSON.stringify(json));         
    log.checkFileCreatedTime(now);      
    ////////////////////////////////////////////////////////////////////////////
    // Not send
    setTimeout(function() {
        connection.sendUTF(JSON.stringify(json));    
    }, 1000);
    console.log(lognow() +msg)
    client.destroy()
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
    console.log(lognow() +msg)
    // close websocket.
    // connection.close();
});
// Socket events
//////////////////////////////////////////////////////////////////////