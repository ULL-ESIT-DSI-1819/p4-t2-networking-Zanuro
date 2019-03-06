"use strict";

const server = require('net').createServer(connection => {
    console.log('Subscriber connected.');

    const firstChunk = '{"type":"changed","timesta';
    const secondChunk = 'mp":1551459934090}\n';

    connection.write(firstChunk);

    const timer = setTimeout(() => {
        connection.write(secondChunk);
        connection.end();

    }, 100);

    connection.on('end', () => {
        clearTimeout(timer);
        console.log('Subscriber connected.');
    });
});

server.listen(60300, function () {
    console.log('Test server listening for subscribers...');
});