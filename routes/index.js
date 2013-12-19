
/*
 * GET home page.
 */
//var request = require("request");
var http = require("http");
var config = require('../config/settings.json');

module.exports.index = function(req, res){
  
  res.render('index', { layout: true, title: 'koharfidtest', borrows: null });
}

module.exports.foundBook = function(req, res){
  console.log(req.params);
  
  var options = {
    host: config.opac_host,
    port: config.opac_port,
    path: "/cgi-bin/koha/rest.pl/holds/"+req.params.biblionumber+"/"+req.params.itemnumber+"/"+req.params.borrowernumber+"/found_book",
    method: 'PUT'
  };
  
  var bookrequest = http.request(options, function(bookresponse) {  
    bookresponse.setEncoding('utf-8');

    var responseString = '';

    bookresponse.on('data', function(data) {
      responseString += data;
    });

    bookresponse.on('end', function() {
      var resultObject = JSON.parse(responseString);
      console.log("response: "+resultObject);
      res.json(resultObject);
    });
  });

  bookrequest.on('error', function(e) {
    console.log("error: "+e)
  });

  //request.write(userString);
  bookrequest.end();

}