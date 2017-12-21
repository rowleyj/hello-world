let mongoose = require('mongoose');

let songSchema = mongoose.Schema({
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

var Song = module.exports = mongoose.model('Song', songSchema ); //'fs.files'
