"use strict";
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
const LDJClient = require('../lib/ldj-client2.js');

describe('LDJClient', () => {
    let stream = null;
    let client = null;

    beforeEach(() => {
        stream = new EventEmitter();
        client = new LDJClient(stream);

    });

    it('should emit a message event from a single data event', done =>{
        client.on('message', message => {
            assert.deepEqual(message, {foo: 'bar'});
            done();
        });
        stream.emit('data', '{"foo":"bar"}\n');
    });
    
    it('should emit a message event from split data events', done =>{
        client.on('message', message => {
            assert.deepEqual(message, {foo: 'bar'});
            done();
        });
        stream.emit('data', '{"foo');
        process.nextTick(() => stream.emit('data', '":"bar"}'));
        process.nextTick(() => stream.emit('data', '\n'));
    });

    it('NULL to LDJ constructor', done => {
        assert.throws(() => {
            new LDJClient(null);
        });
        done();
    });

    it('not properly formatted json string', done =>{
        client.on('message', message => {
            assert.deepEqual(message, "esto es un mensaje de tipo json");
            done();
        });
        stream.emit('data', '"esto es un mensaje de tipo json"\n');
    });

    it('exception for NON-JSON data', done =>{
        assert.throws(() => {
            stream.emit('data', '{"tipo\n');
        });
        done();
    });
     
    it('should emit a message event without "\n" as the delimiter on the close event', done =>{
        client.on('message', message => {
            assert.deepEqual(message, {foo: 'bar'});
            done();
        });
        stream.emit('data', '{"foo":"bar"}');
        stream.emit('close');
    });
});

