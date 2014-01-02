// subscribe to rfid events from server
var sip = new EventSource("/sip");

// render SIP data to Associative array 
function renderSIPdata(sipdata, callback) {
  var arr = sipdata.data.split('|');
  var hash = {}
  status = arr.shift();  // first item is status code and data
  hash.statusCode = status.substr(0,2);
  hash.statusData = status.substr(2);

  arr.splice(-1,1); // remove trailing '|'
  
  arr.forEach (function(item) {
    hash[item.substr(0,2)] = item.substr(2);  // make hash of cmd => value 
  });
  callback(hash);
}

// might be better to create functions based on SIP commands ?
// Not used yet

var SIPcommands = {
  "BL": function(str) {
    str == 'Y' ? true : false ;
  }
}
// add listener to sipdata
sip.addEventListener('sipdata', function(sipdata) {
  console.log("SIP data received:" +sipdata);
  renderSIPdata(sipdata, function(hash){
    console.dir(hash);
    console.log(SIPcommands[hash]);
    if (hash.statusCode == '64') { // patron info response 
      if(hash.BL == 'Y') {
        console.log("valid user login!");
        // save response in session
        var request = $.ajax({
          url: '/usersession',
          type: 'PUT',
          cache: false,
          preventDefault: true,
          data: hash,
          success: function(data) {
            console.log(data);
            
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
          }
        });
      }
      else if(hash.BL == 'N') {
        console.log("invalid user login!");
      }
    }
    if (hash.statusCode == '12') { // checkout response
      // append table here
      console.log("statusdata: "+ hash.statusdata);
    }
  });

}, false);
