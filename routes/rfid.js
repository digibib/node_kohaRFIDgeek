/*
 * send Eventsource header to client and establish connection
 * takes rfid object as input
 */
 
function RFIDRoute() {

  this.eventSource = function(req, res) {
    var rfid = require('../app').rfid;

    // Eventsource header
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    });
    console.log('RFIDClient EventSource Client connect');
    
    // create rfid event listener
    var rfidlistener = function(data) {
      console.log("RFID data sent to browser: "+data);
      res.write("event: rfiddata\r\n");
      res.write("data: "+data+"\r\n\n");
    }
    rfid.on('rfiddata', rfidlistener);
    
    // delete rfiddata listener on close                
    res.on('close', function() {
      rfid.removeListener('rfiddata', rfidlistener);
      console.log("RFIDClient EventSource Client left");
    });
  }

  this.start = function(req, res) {
    var rfid = require('../app').rfid;
    console.log('starting RFID scan loop');
    rfid.start();
    res.send("started RFID scan loop");
  }

  this.stop = function(req, res) {
    var rfid = require('../app').rfid;
    console.log('stopping RFID scan loop');
    rfid.stop();
    res.send("stopped RFID scan loop");
  }
}

module.exports = RFIDRoute;
