
/*
 * GET home page.
 */
var http = require("http");
var config = require('../config/settings.json');

function IndexRoute(session) {

  this.index = function(req, res){
    res.render('index', { layout: true, title: 'koharfidtest', borrows: null });
  }

  this.login = function(req, res){
    var sip = require('../app').sip;
    console.log(req.params);
    var borrower = req.params.userid;
    var pass = req.params.pass;
    var cmd = '6301220131216    135319          AOHUTL|AA'+borrower+'|AC'+config.automatpass+'|AD'+pass+'|BP0001|BQ0100|\r';
    console.log(cmd);
    sip.write(cmd);
    res.send("ok!");
  }
  

  this.usersession = function(req, res){
    console.log(req.body);
    session.user = req.body;
    res.send("ok!");
  }

  this.borrow = function(req, res){
    var sip = require('../app').sip;
    console.log(req.params);
    if (session.user) {
      var cmd = '11YN20131216    13531620131216    135316AO|AA'+session.user.AA+'|AB'+barcode+'|\r';
      console.log(cmd);
      sip.write(cmd);
      res.send("ok!");
    } else {
      res.send("not logged in!");
    }

  }

  this.logout = function(req, res){
    session = {};
    res.send("ok!");
    console.log(session);
  }
}

module.exports = IndexRoute;