const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  metadata:{
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
          },
    tags: [],
}
});

const Song = module.exports = mongoose.model('Song', songSchema);
