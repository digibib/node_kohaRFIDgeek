var assert = require('assert'),
    expect = require('expect.js'),
    //app = require('../app').app,
    sinon = require('sinon'),
    com = require('rfidgeek');

describe('KOHARFIDtest', function() {
  var config = {"base_uri": "http://data.deichman.no/resource/tnr_"};
  
  describe('RFID', function() {
    it('iso15693 tag found should trigger readtagdata event', function(done) {
      var spy = sinon.spy();
      var dummytag = '0C0A0B00';
      var rfid = new com({tagtype: 'iso15693'});
      console.dir(rfid);
      setTimeout(function () {
        expect(spy.called);
        
        done();
      }, 500); //timeout with an error in one second
      rfid.on('readtagdata', spy );  // set spy on readtag event
      rfid.emit('tagfound', dummytag);
      
    });
  });

  describe('SIP response', function() {
    
    it('receives valid SIP response upon login', function(){
      /*book.fromTnr(1, function(err) {
        if (err) { throw Error(err); }
        expect(book.tnr).to.equal(1);
        done();
      });*/
    });

  });

});
