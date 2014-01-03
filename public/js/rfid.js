// subscribe to rfid events from server
var rfid = new EventSource("/rfid");

// load session synchronously
var getSession = function () {
  var json = null;
  $.ajax({
    async: false,
    global: false,
    url: '/session',
    dataType: "json",
    success: function (data) {
      json = data;
    }
  });
  return json;
} 

// checkout item
var checkout = function (barcode) {
  $.ajax({
    type: 'PUT',
    url: '/checkout/'+barcode,
    cache: false,
    preventDefault: true,
    success: function(data) {
      console.log(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseText);
    }
  });
  return true;
} 

// checkin item
var checkin = function (barcode) {
  $.ajax({
    type: 'PUT',
    url: '/checkin/'+barcode,
    cache: false,
    preventDefault: true,
    success: function(data) {
      console.log(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseText);
    }
  });
  return true;
} 

var getRFIDdata = function (rfiddata) {
  var data = rfiddata.data;
  var json = {
    itemno: data.substring(1,2).charCodeAt(0),
    totalitems: data.substring(2,3).charCodeAt(0),
    barcode: data.substring(5,19),
    md5sum: data.substring(19,21),
    country: data.substring(21,23),
    library: data.substring(23,31)
  }
  return json;
}

rfid.addEventListener('rfiddata', function(rfiddata) {
  console.log(rfiddata);
  var session = getSession();
  console.log(session);

  if (rfiddata.data == "tag removed") {
    // do nothing...for now
  } else if (session && session.user) {
   // user session active
    var json = getRFIDdata(rfiddata);
    if (session.checkout) {
      checkout(json.barcode);
    } else {
      checkin(json.barcode);
    } 
  } else {
    var json = getRFIDdata(rfiddata);
    console.log(json);
    console.log("not logged in!");
  }
}, false);
