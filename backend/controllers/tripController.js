const { multer, uploadFileToGCS } = require("../utils/uploadHelper");
const Trip = require('../models/Trip');

const uploadTripPicture = multer.single("tripPicture");

// Create Trip
const createTrip = async (req, res) => {
  try {
    const { title, city, duration, price, description } = req.body;

    if (!title || !city || !duration || !price || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields except image are required."
      });
    }

    let imageUrl = '';
    if (req.file) {
      try {
        imageUrl = await uploadFileToGCS(req.file);
      } catch (uploadErr) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed.",
          error: uploadErr.message
        });
      }
    }

    const newTrip = new Trip({
      title,
      city,
      duration,
      price,
      description,
      image: imageUrl || undefined
    });

    const savedTrip = await newTrip.save();

    res.status(201).json({
      success: true,
      message: "Trip created successfully.",
      trip: savedTrip
    });

  } catch (error) {
    console.error("Trip creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create trip.",
      error: error.message
    });
  }
};

// Get Trip by ID
const getTripById = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found."
      });
    }

    res.status(200).json({ success: true, trip });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve trip.",
      error: error.message
    });
  }
};

// Update Trip
const updateTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const updates = req.body;

    let imageUrl = '';
    if (req.file) {
      try {
        imageUrl = await uploadFileToGCS(req.file);
        updates.image = imageUrl;
      } catch (uploadErr) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed.",
          error: uploadErr.message
        });
      }
    }

    const updatedTrip = await Trip.findByIdAndUpdate(tripId, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedTrip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Trip updated successfully.",
      trip: updatedTrip
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update trip.",
      error: error.message
    });
  }
};

// Delete Trip
const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const deletedTrip = await Trip.findByIdAndDelete(tripId);
    if (!deletedTrip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully.",
      trip: deletedTrip
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete trip.",
      error: error.message
    });
  }
};


const getAllTrips = async (req, res) => {
  try {
    
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = 10; // Items per page
    const skip = (page - 1) * limit;

 
    const trips = await Trip.find()
      .select('_id title city duration price description image')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Trip.countDocuments();

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTrips: total,
      trips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve trips.",
      error: error.message
    });
  }
};

module.exports = {
  uploadTripPicture,
  createTrip,
  getTripById,
  updateTrip,
  deleteTrip,
  getAllTrips
};
