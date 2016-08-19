// dependencies
var fs = require('fs');
var express = require('express');
var routes = require('./routes');
var mongoose = require('mongoose');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;

var User = require('./models/user.js');
var auth = require('./utils/authentication.js');
var sysConfig = require('./config/config.js');

// connect to the database
mongoose.connect('mongodb://' + sysConfig.DATABASE.HOST + '/' + sysConfig.DATABASE.NAME);

var app = express();

app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'my_precious' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// serialize and deserialize
passport.serializeUser(function (user, done) {
  console.log('serializeUser: ' + user._id);
  done(null, user._id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    console.log(user);
    if (!err) done(null, user);
    else done(err, null);
  });
});

// routes
app.get('/', routes.index);
app.get('/account', ensureAuthenticated, function (req, res) {
  User.findById(req.session.passport.user, function (err, user) {
    if (err) {
      console.log(err);  // handle errors
    } else {
      res.render('account', { 
        userName: req.user.name,
        userEmail: req.user.email,
        serviceType: req.user.serviceType 
      });
    }
  });
});

app.get('/auth/facebook',
  passport.authenticate('facebook', {
    scope: ['email']
  }),
  function (req, res) { });
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/',
    scope: ['email']
  }),
  function (req, res) {
    res.redirect('/account');
  });

app.get('/auth/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]
  }
  ));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/account');
  });

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// port
app.listen(1337);

// test authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

module.exports = app;