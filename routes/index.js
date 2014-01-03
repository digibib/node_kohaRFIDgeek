/*
 * GET home page.
 */
var config = require('../config/settings.json');
var moment = require('moment');

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
    res.send("user session saved ok!");
  }

  // activate checkout 
  this.activateCheckout = function(req, res){
    console.log(req.body);
    req.session.checkout = true;
    res.send("activated checkout!");
  }

  // deactivate checkout 
  this.deactivateCheckout = function(req, res){
    console.log(req.body);
    req.session.checkout = false;
    res.send("deactivated checkout!");
  }

  // get session 
  this.getSession = function(req, res){
    res.json(req.session);
  }

  // checkout routine
  // params: barcode
  this.checkout = function(req, res){
    var sip = require('../app').sip;
    console.log(req.params);
    if (req.session.user) {
      var now = moment().format("YYYYMMDD    HHmmss");
      var cmd = '11YN'+now+now+'AOHUTL|AA'+req.session.user.AA+'|AB'+req.params.barcode+'|AC'+config.automatpass+'|\r';
      console.log(cmd);
      sip.write(cmd);
      res.send("sent checkout request to SIP server!");
    } else {
      res.send("not logged in!");
    }
  }

  // checkin routine
  // params: barcode
  this.checkin = function(req, res){
    var sip = require('../app').sip;
    console.log(req.params);
    if (req.session.user) {
      var now = moment().format("YYYYMMDD    HHmmss");
      var cmd = '09YN'+now+now+'AOHUTL|AA'+req.session.user.AA+'|AB'+req.params.barcode+'|\r';
      console.log(cmd);
      sip.write(cmd);
      res.send("sent checkin request to SIP server!");
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
