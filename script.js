// nw.require("nwjs-j5-fix").fix();

// require('nw.gui').Window.get().showDevTools();

var five = require("johnny-five");
var board = new five.Board();
var J5MIDI = require("./midi.js");

// var five = require("johnny-five");
// var board = new five.Board({ port: "/dev/ttyACM0" });

var systemMidiStart, systemMidiEnd;
var j5MidiStart, j5MidiEnd;

board.on("ready", function() {


  console.log('ready');
    // console.log(board.io.SERIAL_PORT_IDs.SW_SERIAL0);
    var j5midi = new J5MIDI({
      io: board.io,
      // Mega 2560
      portId: board.io.SERIAL_PORT_IDs.HW_SERIAL1,
      pins: { rx: 18, tx: 19 },
      console: console
  });

  // console.log(midi);

  j5midi.on("receive", function(data) {
    console.log("J5 MIDI incoming data", data);
    j5MidiEnd = new Date();
    // console.log('end at', end.getTime());
    console.log('J5 MIDI round trip at', j5MidiEnd.getTime() - j5MidiStart.getTime(), 'ms');
  });

  var led = new five.Led(13);
  // led.blink(500);

  var i = 0;

  setInterval(function() {
    "use strict";

    j5midi.sendBytes([i]);
    j5MidiStart = new Date();
    // console.log('start at', start.getTime());

    led.toggle();

    i++;

    if (i > 16) {
      i = 0;
    }

  }, 2000);
});

// board.on('connect', function() {
//     console.log('connected');
// });



var systemMidi = require('midi');

// Set up a new input.
var systemInput = new systemMidi.input();
var systemOutput = new systemMidi.output();

var inputPortsCount = systemInput.getPortCount();
var outputPortsCount = systemOutput.getPortCount();

// Count the available input ports.
console.log("System MIDI input ports count is", inputPortsCount);

for (var ii = 0; ii < inputPortsCount; ii++) {
  console.log("[" + ii + "] System MIDI input port name is", systemInput.getPortName(ii));
}

// Count the available input ports.
console.log("System MIDI output ports count is", outputPortsCount);

for (var oi = 0; oi < inputPortsCount; oi++) {
  console.log("[" + oi + "] System MIDI output port name is", systemOutput.getPortName(oi));
}



// Configure a callback.
systemInput.on('message', function(deltaTime, message) {
  systemMidiEnd = new Date();

  // The message is an array of numbers corresponding to the MIDI bytes:
  //   [status, data1, data2]
  // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
  // information interpreting the messages.
  console.log('System MIDI data:', message); // ' d:' + deltaTime

  // console.log('end at', end.getTime());
  console.log('System MIDI round trip at', systemMidiEnd.getTime() - systemMidiStart.getTime(), 'ms');
});

var inputPortIndex = 4;
var outputPortIndex = 4;

if (inputPortIndex < inputPortsCount) {
// Open the first available input port.
  systemInput.openPort(inputPortIndex);
}

if (outputPortIndex < outputPortsCount) {
  systemOutput.openPort(outputPortIndex);
}


setInterval(function() {
  "use strict";

  systemMidiStart = new Date();

  // Send a MIDI message.
  systemOutput.sendMessage([ 0x90, 32, 127 ]);
}, 2000);
