"use strict";
const EventEmitter = require ('events').EventEmitter;

class LDJClient extends EventEmitter {
    constructor(stream){
        if(stream === null){
            throw new Error('The passed stream is null');
        }
        super();
        let buffer = '';
    stream.on('data',data => {
        buffer += data;
        let boundary = buffer.indexOf('\n');
        while (boundary !== -1){
            const input = buffer.substring(0, boundary);
            buffer = buffer.substring(boundary + 1);
            try{
                this.emit('message', JSON.parse(input));
            }
            catch (err){
                throw new Error('Message sent is not a properly formatted JSON message');
            }
            boundary = buffer.indexOf('\n');

        }
    });
    stream.on('close', () => {
        
        let boundary = buffer.indexOf('}');
        if(boundary !== -1){
            const input = buffer.substring(0, boundary+1);
            try{
                this.emit('message', JSON.parse(input));
            }
            catch (err){
                throw new Error('Message sent is not a properly formatted JSON message');
            }
        }
        else
            throw new Error('Message not properly endend with a "}"');
    });
    }

    static connect(stream){
        return new LDJClient(stream);
    }
}

module.exports = LDJClient;
