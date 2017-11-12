const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
          },
  artist: {
    type: String,
    required: true
          },
  album: {
    type: String,
    required: true
  } 
});

const Song = module.exports = mongoose.model('Song', songSchema);
