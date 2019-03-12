"use strict";
/** load net module which lets us connect on a port that the server is listening and we connect at the 60300 port*/
const net = require('net');
const client = net.connect({port : 60300});
/** The client on receiving a data chunk parses it to a message as a JSON type object */
client.on('data', data => {

        const message = JSON.parse(data);

        /** If the message type of the json type message is watching then print on console the file that is being watcher*/
        if(message.type === 'watching'){
            console.log(`Now watching ${message.file}`);
        }
        /** If the message type of the json type message is changed then it gets the date(timestamp) of the message and print when the file changed*/
        else if (message.type === 'changed'){
            const date = new Date(message.timestamp);
            console.log(`File changed ${date}`);
        }
        /** In other case the type of the message is not known and it prints the message type */
        else {
            console.log(`Unrecognized message type : ${message.type}`);
        }

});

