const mongoose = require('mongoose');

const topTouristPlaceSchema = new mongoose.Schema({
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  locationName: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('TopTouristPlace', topTouristPlaceSchema);
