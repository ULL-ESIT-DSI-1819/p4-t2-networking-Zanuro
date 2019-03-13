"use strict";

const fs = require('fs');
const net = require('net'); 

let sockets = [];
let users = 0;

function broadcast(from, message) {
    
    if(sockets.length != 0){
        sockets.forEach(function(conn){
            if(from != sockets.indexOf(conn)){
                conn.write(`User ${from} says :  ${message}`);
            }
        });
    }
};

net.createServer( connection => {
    sockets[users] = connection;

    connection.write('Welcome to the telnet chat!\n');
    console.log('Guest ' + users + ' joined this chat\n');
    broadcast(users,`I have connected\n`);
    users++;

    connection.on('data', data => {
        console.log(`User ${sockets.indexOf(connection)} says :  ${data}`);
        broadcast(sockets.indexOf(connection),data);
    });
    connection.on('close', close => {
        console.log('Guest ' + sockets.indexOf(connection) + ' disconnected from the chat');
        users--;
        sockets.splice(sockets.indexOf(connection));
    });
}).listen(8000, () => console.log('Server listening at http://localhost:8000 \n'));