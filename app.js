/**
 * Module dependencies.
 */

var express = require('express');
var ejs = require('ejs');
var expressLayouts = require('express-ejs-layouts');
var http = require('http');
var path = require('path');

/**
 * Config
 */

var config = require('./config/settings.json');

// SIP settings
var net = require('net');
var sip = net.connect(config.sip_port, config.sip_host);

// RFID settings
var Rfidgeek = require('/home/benjab/github/node_rfidgeek/rfid.js');
// instantiating a reader
var rfid = new Rfidgeek({
  portname: config.rfid_portname,
  debug: 'error',
  websocket: false,
  tagtype: 'ISO15693',
  bytes_to_read: 1,
  length_to_read: 26  // 26 blocks (=52 bytes) to grab entire content
});
rfid.init();
rfid.start();

/**
 * Environment
 */

var app = express();

// All environments
app.set('port', process.env.PORT || config.app_port );
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(expressLayouts);
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

// Development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

/*
 * App locals, accessible to all routes and renderings
 */

var session = {};
app.locals({session: session, env: app.get('env')});

/**
 * Routes
 */
// var routes = require('./routes');    // automatically requires 'routes/index.js'
var IndexRoute = require('./routes/index.js');
var RFIDRoute = require('./routes/rfid.js');
var SIPRoute = require('./routes/sip.js');

/*
 * Route Handlers
 */

var Handlers = {
    Index: new IndexRoute(session),
    RFID: new RFIDRoute(),
    SIP: new SIPRoute()
};


app.get('/', Handlers.Index.index);
app.put('/login/:userid/:pass', Handlers.Index.login);
app.get('/logout', Handlers.Index.logout);
app.put('/usersession', Handlers.Index.usersession);
app.get('/rfid', Handlers.RFID.eventSource);
app.get('/sip', Handlers.SIP.eventSource);

app.put('/borrow/:userid/:barcode', Handlers.Index.borrow);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

/**
 * export modules
 */

module.exports.rfid = rfid;
module.exports.sip  = sip;
module.exports.session = session;