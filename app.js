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

// Memory session store

// SIP settings
var net = require('net');
var sip = net.connect({port: config.sip_port, host: config.sip_host}, function() {
  console.log('connected to SIP server');
  var cmd = '9300CN'+config.automatuser+'|CO'+config.automatpass+'|CPHUTL|\r';
  console.log(cmd);
  sip.write(cmd);
  console.log('logged in automat');
});
sip.on('end', function() {
  console.log('disconnected from SIP server');
});
sip.on('error', function() {
  console.log('error connecting to SIP server!');
})

// RFID settings
var Rfidgeek = require('rfidgeek');
// instantiating a reader

var rfid = new Rfidgeek({
  portname: config.rfid_portname,
  debug: config.rfid_debuglevel, // 'debug', 'error' or 'none'
  scaninterval: config.rfid_scaninterval,
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
app.use(expressLayouts);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
// session storage
app.use(express.cookieParser());
app.use(express.session({secret: config.session_secret }));
// router
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

// Development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

/*
 * App locals, accessible to all routes and renderings
 */

app.locals({env: app.get('env')});

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
    Index: new IndexRoute(),
    RFID: new RFIDRoute(),
    SIP: new SIPRoute()
};


app.get('/', Handlers.Index.index);
app.put('/login/:userid/:pass', Handlers.Index.login);
app.get('/logout', Handlers.Index.logout);
app.put('/usersession', Handlers.Index.saveUserSession);
app.put('/activatecheckout', Handlers.Index.activateCheckout);
app.put('/deactivatecheckout', Handlers.Index.deactivateCheckout);
app.get('/session', Handlers.Index.getSession);
app.get('/sip', Handlers.SIP.eventSource);
app.get('/rfid', Handlers.RFID.eventSource);

app.put('/rfidrestart', Handlers.RFID.restart);
app.put('/checkout/:barcode', Handlers.Index.checkout);
app.put('/checkin/:barcode', Handlers.Index.checkin);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

/**
 * export modules
 */

module.exports.rfid = rfid;
module.exports.sip  = sip;
