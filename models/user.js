var mongoose = require('mongoose');

// create a user model
var User = mongoose.model('User', {
  oauthID: Number,
  name: String,
  serviceType: String,
  email: String,
  created: Date
});

module.exports = User;