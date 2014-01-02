/*
 * send Eventsource header to client and establish connection
 * Forward SIP response data to EventSource browser client */
 
function SIPRoute() {

  this.eventSource = function(req, res) {
    var sip = require('../app').sip;

    // Eventsource header
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
    });
    console.log('SIP EventSource Client connect');
    
    // login automat
    // var cmd = '9300CNautohoved1|COpass|CPHUTL|\r';
    // sip.write(cmd);
    
    // create sip event listener
    var siplistener = function(data) {
      console.log("SIP data sent to browser: "+data);
      res.write("event: sipdata\r\n");
      res.write("data: "+data+"\r\n\n");
    }
    sip.on('data', siplistener);
    
    // delete rfiddata listener on close                
    res.on('close', function() {
      sip.removeListener('data', siplistener);
      console.log("SIP EventSource Client left");
    });
  }

}

module.exports = SIPRoute;
