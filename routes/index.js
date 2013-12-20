/*
 * GET home page.
 */
var http = require("http");
var config = require('../config/settings.json');

function IndexRoute(session) {

  this.index = function(req, res){
    res.render('index', { session: req.session, layout: true, title: 'koharfidtest', borrows: null });
  }

  // log in user from SIP response
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
  
  // save user session 
  this.usersession = function(req, res){
    console.log(req.body);
    req.session.user = req.body;
    res.send("user session saved ok!");
  }

  // add book to checkout
  this.borrow = function(req, res){
    var sip = require('../app').sip;
    console.log(req.params);
    if (req.session.user) {
      var cmd = '11YN20131216    13531620131216    135316AO|AA'+session.user.AA+'|AB'+barcode+'|\r';
      console.log(cmd);
      sip.write(cmd);
      res.send("book checked out!");
    } else {
      res.send("not logged in!");
    }

  }

  // log out and destroy session
  this.logout = function(req, res){
    req.session.destroy(function() {
      res.send("destroyed session!");
    });
  }

}

module.exports = IndexRoute;
