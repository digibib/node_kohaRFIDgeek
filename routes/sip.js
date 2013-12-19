/*
 * send SIP command to Koha SIP2 server
 */
 
function SIPRoute() {

  this.eventSource = function(req, res) {
    var sip = require('../app').sip;

    // Eventsource header
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    });
    console.log('SIPClient connect');
    
    // login automat
    console.log('connected');
    var cmd = '9300CNautohoved1|COpass|CPHUTL|\r';
    sip.write(cmd);

    // create rfid event listener
    var SIPlistener = function(data) {
      console.log("SIP data received in external app: "+data);
      res.write("event: SIPdata\r\n");
      res.write("data: "+data+"\r\n\n");
    }
    sip.on('data', SIPlistener);
    
    // delete rfiddata listener on close                
    res.on('close', function() {
      sip.removeListener('SIPdata', SIPlistener);
      console.log("SIPClient left");
    });
  }

}

module.exports = SIPRoute;
