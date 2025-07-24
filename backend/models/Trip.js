const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  duration: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  image: { type: String, default: '' } // ✅ Optional image field
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
