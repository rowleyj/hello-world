const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
          },
  firstName: {
    type: String,
    required: true
          },
  lastName: {
    type: String,
    required: true
          },
  eMail: {
    type: String,
    required: true
          },
  password: {
    type: String,
    required: true
          }
});

const User = module.exports = mongoose.model('User', UserSchema);
