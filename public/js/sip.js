// subscribe to rfid events from server
var sip = new EventSource("/sip");

sip.addEventListener('SIPdata', function(SIPdata) {
  console.log(SIPdata);
  if (SIPdata.data == "tag removed") {
    // do nothing...for now
  } else {
    var data = SIPdata.data;
    console.log(data);
  }
}, false);
