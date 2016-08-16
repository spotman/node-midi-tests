// var five = require("johnny-five");
var Emitter = require("events"); //.EventEmitter;
var util = require("util");

// var priv = new Map();

function J5MIDI(opts) {

  // five.Board.call(
  //   this, opts = five.Board.Options(opts)
  // );

  // opts = five.Board.Options(opts);

  this.console = opts.console;

  this.io = opts.io;

  // this.console.log('io is', this.io);

  this.portId = opts.portId || this.io.SERIAL_PORT_IDs.SW_SERIAL0;
  this.baud = opts.baud || 9600;
  this.rxPin = opts.pins.rx;
  this.txPin = opts.pins.tx;

  // priv.set(this, state);

  this.io.serialConfig({
    portId: this.portId,
    baud:   this.baud,
    rxPin:  this.rxPin,
    txPin:  this.txPin
  });

  this.io.serialRead(this.portId, function (bytes) {
    // read bytes and determine event types to emit
    // store received things in state object, use
    // for emitting events
    //
    // this.console.log('serialRead got some data', bytes);
    this.emit('receive', bytes);
  }.bind(this));

  /*
   Object.defineProperties(this, {
   // Define any accessors here
   });
   */
}

util.inherits(J5MIDI, Emitter);


J5MIDI.prototype.sendBytes = function (bytes) {
  // implement
  // var state = priv.get(this);

  this.io.serialWrite(this.portId, bytes);
  // this.console.log('serialWrite sent some data', bytes);
};

module.exports = J5MIDI;
