const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
  _id: ObjectId(...),
  filename: String,
  uploadDate: ISODate(...),
  contentType: 'audio/mp3',
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
      required: true
          },
    tags: [...],
}
});

const Song = module.exports = mongoose.model('Song', songSchema);
