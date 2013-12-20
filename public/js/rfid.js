// subscribe to rfid events from server
var rfid = new EventSource("/rfid");

rfid.addEventListener('rfiddata', function(rfiddata) {
  console.log(rfiddata);
  if (rfiddata.data == "tag removed") {
    // do nothing...for now
  } else if (session.user) {
    console.log("borrowed item!");

  } else {
    var data = rfiddata.data;
    var json = {
      itemno: data.substring(1,2).charCodeAt(0),
      totalitems: data.substring(2,3).charCodeAt(0),
      barcode: data.substring(5,19),
      md5sum: data.substring(19,21),
      country: data.substring(21,23),
      library: data.substring(23,31)
    }
  console.log(json);
  }
}, false);
