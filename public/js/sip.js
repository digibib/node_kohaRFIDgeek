// subscribe to rfid events from server
var sip = new EventSource("/sip");

// render SIP data to Associative array 
function renderSIPdata(sipdata, callback) {
  var arr = sipdata.data.split('|');
  arr.splice(0,1);
  arr.splice(-1,1);
  var hash = {}
  arr.forEach (function(item) {
    hash[item.substr(0,2)] = item.substr(2);  // make hash of cmd => value 
  });
  callback(hash);
}

sip.addEventListener('sipdata', function(sipdata) {
  console.log("SIP data received:" +sipdata);
  renderSIPdata(sipdata, function(hash){
    console.dir(hash);
    if(hash.BL == 'Y') {
      console.log("valid user!");
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

  });

}, false);
