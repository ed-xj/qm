#!/usr/local/bin/node

var fs = require('fs');
var ini = require('ini');
var iniFile = __dirname + '/../config/system.ini';

console.log('Content-type: application/json \n');
//console.log('<p>current directory:'+__dirname + '</p>');
//console.log('<p>ini file:'+iniFile +'</p>');

fs.readFile(iniFile, 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
//    console.log(data);
//    console.log('<p>Parsed ini</p>');
    console.log(JSON.stringify(ini.parse(data)));
});


//console.log('<h1>hello world from NODE.js(.sjs file)</h1>');
//
//var i = 0;
//
//for (i=0; i<5; i++)
//{
//    console.log('<p>' + i + '<p/>');
//}

//console.log('<h2>before parse</h2>');
//parser.parseFileSync(iniFile, function(error, data){
//    console.log('<h2>Got data</h2>');
//});
//console.log( parser.parseFileSync(iniFile) );

//console.log('<h2>after parse</h2>');






