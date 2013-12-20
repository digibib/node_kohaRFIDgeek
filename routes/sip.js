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
    // var cmd = '9300CNautohoved1|COpass|CPHUTL|\r';
    // sip.write(cmd);
    
    // create sip event listener
    var siplistener = function(data) {
      console.log("SIP data received in external app: "+data);
      res.write("event: sipdata\r\n");
      res.write("data: "+data+"\r\n\n");
    }
    sip.on('data', siplistener);
    
    // delete rfiddata listener on close                
    res.on('close', function() {
      sip.removeListener('data', siplistener);
      console.log("SIPClient left");
    });
  }

}

module.exports = SIPRoute;
