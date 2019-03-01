"use strict";

    const fs = require('fs');
    const net = require('net');

    const filename = process.argv[2];

    if(!filename){
        throw Error('Error no filename specified in the command line..');
    }

    net.createServer(connection => {

        console.log('Subscriber connected.');
        connection.write(`Now watching  "${filename}" for changes \n`);

        const watcher = fs.watch(filename, () => connection.write(`File ${filename} changed at : ${new Date()}\n`));

        connection.on('close',() => {
            console.log('Subscriber disconnected');
            watcher.close();
        });
    }).listen('/tmp/watcher.sock', () => console.log('Listening for subscribers...'));