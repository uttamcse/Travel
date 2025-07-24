const Hotel = require('../models/Hotel');
const { multer, uploadFileToGCS } = require('../utils/uploadHelper');

const uploadHotelImage = multer.single("hotelImage");

// CREATE hotel with image
const createHotel = async (req, res) => {
  try {
    const { name, pricePerNight, rating, description } = req.body;

    if (!name || !pricePerNight || !rating || !description) {
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

    const newHotel = new Hotel({
      name,
      pricePerNight,
      rating,
      description,
      image: imageUrl || ''
    });

    const savedHotel = await newHotel.save();

    res.status(201).json({
      success: true,
      message: "Hotel created successfully.",
      hotel: savedHotel
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create hotel.",
      error: error.message
    });
  }
};

// GET all hotels with pagination
const getAllHotels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const hotels = await Hotel.find()
      .skip(skip)
      .limit(limit)
      .select('_id name pricePerNight rating description image');

    const total = await Hotel.countDocuments();

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      hotels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve hotels.",
      error: error.message
    });
  }
};

// GET hotel by ID
const getHotelById = async (req, res) => {
  try {
    const {hotelId} = req.params;
     const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ 
        success: false, 
        message: "Hotel not found" 
    });
    }
    res.status(200).json({ 
        success: true,
        message: "Hotel fetched successfully.", 
        hotel 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching hotel.",
      error: error.message
    });
  }
};

// UPDATE hotel by ID (with image if provided)
const updateHotelById = async (req, res) => {
  try {
    const { hotelId } = req.params;
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

    const updatedData = {
      ...req.body,
      ...(imageUrl && { image: imageUrl })
    };

    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, updatedData, {
      new: true,
      runValidators: true
    });

    if (!updatedHotel) {
      return res.status(404).json({ 
        success: false, 
        message: "Hotel not found" 
    });
    }

    res.status(200).json({
      success: true,
      message: "Hotel updated successfully.",
      hotel: updatedHotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update hotel.",
      error: error.message
    });
  }
};

// DELETE hotel
const deleteHotelById = async (req, res) => {
  try {
 const { HotelId } = req.params;

    const deletedHotel = await Hotel.findByIdAndDelete(HotelId);
    if (!deletedHotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    res.status(200).json({
      success: true,
      message: "Hotel deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete hotel.",
      error: error.message
    });
  }
};

module.exports = {
  uploadHotelImage,
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotelById,
  deleteHotelById
};
