// controllers/search.js
const Trip = require('../models/Trip');

const searchTripsByCity = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ 
        success: false,
        message: "City query parameter is required."
      });
    }

    const trips = await Trip.find({ city: { $regex: new RegExp(city, 'i') } })
      .select('_id title city duration price description image');

    if (trips.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "No trips found for that city."
      });
    }

    res.status(200).json({
      success: true,
      message: `Found ${trips.length} trip(s) in ${city}`,
      trips
    });

  } catch (error) {
    console.error("Trip search error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while searching trips.",
      error: error.message
    });
  }
};

module.exports = { searchTripsByCity };
