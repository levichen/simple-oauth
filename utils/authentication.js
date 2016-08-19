var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var User = require('../models/user.js');
var sysConfig = require('../config/config.js');

module.exports = passport.use(new FacebookStrategy({
  clientID: sysConfig.OAUTH.FACEBOOK.clientID,
  clientSecret: sysConfig.OAUTH.FACEBOOK.clientSecret,
  callbackURL: sysConfig.OAUTH.FACEBOOK.callbackURL,
  profileFields: ['id', 'displayName', 'email']
},
  function (accessToken, refreshToken, profile, done) {
    var email = (profile.emails !== undefined) ? profile.emails[0].value : 'can not get';
    User.findOne({ oauthID: profile.id }, function (err, user) {
      if (err) {
        console.log(err);  // handle errors!
      }
      if (!err && user !== null) {
        done(null, user);
      } else {
        user = new User({
          oauthID: profile.id,
          name: profile.displayName,
          email: email,
          serviceType: 'Facebook',
          created: Date.now()
        });
        user.save(function (err) {
          if (err) {
            console.log(err);  // handle errors!
          } else {
            console.log("saving user ...");
            done(null, user);
          }
        });
      }
    });
  }
));

passport.use(new GoogleStrategy({
  clientID: sysConfig.OAUTH.GOOGLE.clientID,
  clientSecret: sysConfig.OAUTH.GOOGLE.clientSecret,
  callbackURL: sysConfig.OAUTH.GOOGLE.callbackURL
},
  function (request, accessToken, refreshToken, profile, done) {
    User.findOne({ oauthID: profile.id }, function (err, user) {
      if (err) {
        console.log(err);  // handle errors!
      }
      if (!err && user !== null) {
        done(null, user);
      } else {
        user = new User({
          oauthID: profile.id,
          name: profile.displayName,
          serviceType: 'Google',
          email: profile.email,
          created: Date.now()
        });
        user.save(function (err) {
          if (err) {
            console.log(err);  // handle errors!
          } else {
            console.log("saving user ...");
            done(null, user);
          }
        });
      }
    });
  }
));
