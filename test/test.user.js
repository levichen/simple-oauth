var should = require('should');
var mongoose = require('mongoose');
var User = require('../models/user.js');
var sysConfig = require('../config/config.js');

describe('User', function() {

  before(function(done) {
    db = mongoose.connect('mongodb://' + sysConfig.DATABASE.HOST + '/' + sysConfig.DATABASE.NAME);
    done();
  });

  after(function(done) {
    mongoose.connection.close();
    done();
  });

  beforeEach(function(done) {
    var user = new User({
      oauthID: 12345,
      name: 'testy',
      created: Date.now()
    });

    user.save(function(error) {
      if (error) console.log('error' + error.message);
      else console.log('no error');
      done();
    });

  });

  afterEach(function(done) {
    User.remove({}, function() {
      done();
    });
  });

  it('find a user by username', function(done) {
    User.findOne({ oauthID: 12345, name: "testy" }, function(err, user) {
      user.name.should.eql('testy');
      user.oauthID.should.eql(12345);
      console.log("   name: ", user.name);
      console.log("   oauthID: ", user.oauthID);
      done();
    });
  });
});