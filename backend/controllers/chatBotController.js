const Trip = require('../models/Trip');
const Hotel = require('../models/Hotel');
const TopTouristPlace = require('../models/TopTouristPlace');

const chatbotHandler = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Please provide a message to process."
    });
  }

  const lowerMsg = message.toLowerCase();

  try {
    // Match: Trips
    if (lowerMsg.includes("trip") || lowerMsg.includes("trips to")) {
      const locationMatch = lowerMsg.match(/trips? to ([a-z\s]+)/);
      const location = locationMatch?.[1]?.trim();

      if (location) {
        const trips = await Trip.find({ city: new RegExp(location, 'i') });
        return res.json({
          success: true,
          message: `Trips to ${location}`,
          data: trips
        });
      }
    }

    // Match: Hotels
    if (lowerMsg.includes("hotel") || lowerMsg.includes("hotels in")) {
      const locationMatch = lowerMsg.match(/hotels? in ([a-z\s]+)/);
      const location = locationMatch?.[1]?.trim();

      if (location) {
        const hotels = await Hotel.find({ location: new RegExp(location, 'i') });
        return res.json({
          success: true,
          message: `Hotels in ${location}`,
          data: hotels
        });
      }
    }

    // Match: Tourist Places
    if (lowerMsg.includes("visit") || lowerMsg.includes("places in")) {
      const locationMatch = lowerMsg.match(/(?:visit|places in|what can I visit in)\s+([a-z\s]+)/i);
      const location = locationMatch?.[1]?.trim();

      if (location) {
        const places = await TopTouristPlace.find({ locationName: new RegExp(location, 'i') });
        return res.json({
          success: true,
          message: `Tourist places in ${location}`,
          data: places
        });
      }
    }

    // Fallback
    return res.json({
      success: true,
      message: "Sorry, I couldn't understand your query. Try asking about trips, hotels, or tourist places.",
      data: []
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Chatbot error",
      error: error.message
    });
  }
};

module.exports = { chatbotHandler };
