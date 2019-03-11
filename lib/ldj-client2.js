/** unitialized variables not accepted  also load the 'events' submodule from EventEmitter module */
"use strict";
const EventEmitter = require ('events').EventEmitter;

/**
 * This is the LDJClient class extending the EventEmitter class
 * @name LDJClient
 */
class LDJClient extends EventEmitter {

    /**
     * This is the constructor of the LDJClient class
     * @name constructor
     * @param stream
     * If a given stream is null throw an error specifying that the stream given is null
     */
    constructor(stream){
        if(stream === null){
            throw new Error('The passed stream is null');
        }
        /** using super inside constructor as if it's a derivated class, also we need to call super() before accesing this */
        super();
        /** Initialize buffer storing the data we need to parse at each given moment */
        let buffer = '';
    
    /**
     * This is the data event while watching the stream
     * @name stream.on
     * @param data
     * Finds the index of the delimiter used for separating a message into multiple data events and emits the parsified as a JSON input as a message.
     * if it catches an error means that the message is not a properly formatted JSON message
     * Does this until the end of the data chunk
     */
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
    
    /**
     * This is the data event while watching the stream
     * @name stream.on
     * @param data
     * Finds the index of the delimiter used for separating a message into multiple data events and emits the parsified as a JSON input as a message.
     * if it catches an error means that the message is not a properly formatted JSON message
     * Does this until the end of the data chunk
     */
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
