const { createRouter } = require("../utils/routerHelper");
const HttpMethods = require("../utils/httpMethods");
const {
  uploadTripPicture,
  createTrip,
  getTripById,
  updateTrip,
  deleteTrip
} = require("../controllers/tripController");

const routes = [
  // Create a new trip (supports optional image upload)
  {
    method: HttpMethods.POST,
    path: "/trips",
    handlers: [uploadTripPicture, createTrip],
  },

  // Get a trip by ID
  {
    method: HttpMethods.GET,
    path: "/trips/:tripId",
    handlers: [getTripById],
  },

  // Update a trip by ID (supports optional image update)
  {
    method: HttpMethods.PUT,
    path: "/trips/:tripId",
    handlers: [uploadTripPicture, updateTrip],
  },

  // Delete a trip by ID
  {
    method: HttpMethods.DELETE,
    path: "/trips/:tripId",
    handlers: [deleteTrip],
  },
];

const router = createRouter(routes);

module.exports = router;
