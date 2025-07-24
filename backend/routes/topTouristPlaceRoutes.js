const { createRouter } = require("../utils/routerHelper");
const HttpMethods = require("../utils/httpMethods");

const {
  uploadTopTouristImage,
  createTopTouristPlace,
  getTopTouristPlaceById,
  updateTopTouristPlaceById,
  deleteTopTouristPlaceById,
} = require("../controllers/topTouristPlaceController");

const routes = [
  {
    method: HttpMethods.POST,
    path: "/top-places",
    handlers: [uploadTopTouristImage, createTopTouristPlace],
  },
  {
    method: HttpMethods.GET,
    path: "/top-places/:placeId",
    handlers: [getTopTouristPlaceById],
  },
  {
    method: HttpMethods.PUT,
    path: "/top-places/:placeId",
    handlers: [uploadTopTouristImage, updateTopTouristPlaceById],
  },
  {
    method: HttpMethods.DELETE,
    path: "/top-places/:placeId",
    handlers: [deleteTopTouristPlaceById],
  },
];

const router = createRouter(routes);

module.exports = router;
