const TopTouristPlace = require('../models/TopTouristPlace');
const { multer, uploadFileToGCS } = require('../utils/uploadHelper');

const uploadTopTouristImage = multer.single("placeImage"); 

const createTopTouristPlace = async (req, res) => {
  try {
    const { description, locationName } = req.body;

    if (!description || !locationName) {
      return res.status(400).json({
        success: false,
        message: "Description and location name are required."
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

    const newPlace = new TopTouristPlace({
      image: imageUrl || '',
      description,
      locationName
    });

    await newPlace.save();

    res.status(201).json({
      success: true,
      message: "Top tourist place created successfully.",
      place: newPlace
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating top tourist place.",
      error: error.message
    });
  }
};

// GET a single tourist place by ID
const getTopTouristPlaceById = async (req, res) => {
  try {
    const { placeId } = req.params;

    const place = await TopTouristPlace.findById(placeId);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Top tourist place not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Top tourist place fetched successfully.",
      place
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching top tourist place.",
      error: error.message
    });
  }
};

// UPDATE tourist place by ID
const updateTopTouristPlaceById = async (req, res) => {
  try {
    const { placeId } = req.params;
    const { description, locationName } = req.body;

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

    const updates = {
      ...(description && { description }),
      ...(locationName && { locationName }),
      ...(imageUrl && { image: imageUrl })
    };

    const updatedPlace = await TopTouristPlace.findByIdAndUpdate(placeId, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedPlace) {
      return res.status(404).json({
        success: false,
        message: "Top tourist place not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Top tourist place updated successfully.",
      place: updatedPlace
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating top tourist place.",
      error: error.message
    });
  }
};

// DELETE tourist place by ID
const deleteTopTouristPlaceById = async (req, res) => {
  try {
    const { placeId } = req.params;

    const deletedPlace = await TopTouristPlace.findByIdAndDelete(placeId);
    if (!deletedPlace) {
      return res.status(404).json({
        success: false,
        message: "Top tourist place not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Top tourist place deleted successfully."
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting top tourist place.",
      error: error.message
    });
  }
};

module.exports = {
  uploadTopTouristImage,
  createTopTouristPlace,
  getTopTouristPlaceById,
  updateTopTouristPlaceById,
  deleteTopTouristPlaceById
};
