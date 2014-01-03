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

// save user session
var saveUserSession = function (hash) {
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
  return true;
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
    //console.log(SIPcommands[hash]);
    if (hash.statusCode == '64') { // patron info response 
      if(hash.BL == 'Y') {
        console.log("valid user login!");
        // save response in user session
        saveUserSession(hash);
      }
      else if(hash.BL == 'N') {
        console.log("invalid user login!");
      }
    }
    if (hash.statusCode == '12') { // checkout response
      console.log("statusdata: "+ hash.statusData);
      console.log("checkout ok?: "+ hash.statusData.substr(0,1));
      console.log("renewal?: "+ hash.statusData.substr(1,1));
      console.log("magnetisk?: "+ hash.statusData.substr(2,1));
      console.log("skru av RFID?: "+ hash.statusData.substr(3,1));
      console.log("date: "+ hash.statusData.substr(4,18));
      if (hash.statusData.substr(0,1) == '0') { // not checked out
        console.log("not checked out!");
        if (hash.statusData.substr(1,1) == 'N') {  // not renewed either
          alert("not renewed! reason: "+hash.AF);
        } else if (hash.statusData.substr(1,1) == 'Y') {  // renewed
          $('<tr>').attr('id',hash.AB)
            .append($('<td>').text(hash.AB))
            .append($('<td>').text(hash.AJ))
            .append($('<td>').text(hash.AF))
            .append($('<td>').text(hash.AH))
            .appendTo('#borrowtable tbody');
          console.log("renewed to: "+hash.AH);
        }
      } else if (hash.statusData.substr(0,1) == '1') { // checked out
        console.log("checked out!");
        console.log("due date: "+hash.AH);
        console.log("msg: "+hash.AF);
        console.log("barcode: "+hash.AB);
        console.log("title: "+hash.AJ);
        //var last_td = $('tr#'+rowid+ " td:last");
        $('<tr>').attr('id',hash.AB)
          //.append($('<td><button>stop</button></td>').click(function () { stop({id: job.job_id}); }))
          .append($('<td>').text(hash.AB))
          .append($('<td>').text(hash.AJ))
          .append($('<td>').text(hash.AF))
          .append($('<td>').text(hash.AH))
          .appendTo('#borrowtable tbody');
      }
    }
    if (hash.statusCode == '10') { // checkin response
      console.log("statusdata: "+ hash.statusData);
      if (hash.statusData.substr(0,1) == '0') { // not checked in
        console.log("not checked in!");
      } else if (hash.statusData.substr(0,1) == '1') { // checked in
        console.log("checked in!");
        console.log("due date: "+hash.AH);
        console.log("msg: "+hash.AF);
        console.log("barcode: "+hash.AB);
        console.log("title: "+hash.AJ);
        $('<tr>').attr('id',hash.AB)
          .append($('<td>').text(hash.AB))
          .append($('<td>').text(hash.AJ))
          .append($('<td>').text(hash.AF))
          .append($('<td>').text(''))
          .append($('<td>').text(hash.statusData.substr(4,18)))
          .appendTo('#borrowtable tbody');
      } else {
        console.log("something went wrong!");
      }
    }
  });

}, false);
