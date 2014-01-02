/*
 * GET home page.
 */
var http = require("http");
var config = require('../config/settings.json');

function IndexRoute() {

  this.index = function(req, res){
    res.render('index', { session: req.session, cookie: req.cookies, layout: true, title: 'koharfidtest', borrows: null });
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
  this.saveUserSession = function(req, res){
    console.log(req.body);
    req.session.user = req.body;
    //req.session.save();
    res.send("user session saved ok!");
  }

  // get user session 
  this.getUserSession = function(req, res){
    res.json(req.session.user);
  }

  // add book to checkout
  // params: barcode
  this.borrow = function(req, res){
    var sip = require('../app').sip;
    console.log(req.params);
    if (req.session.user) {
      var cmd = '11YN20131216    13531620131216    135316AOHUTL|AA'+req.session.user.AA+'|AB'+req.params.barcode+'|\r';
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
