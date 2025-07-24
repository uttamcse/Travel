const { createRouter } = require("../utils/routerHelper");
const HttpMethods = require("../utils/httpMethods");

const {
  uploadHotelImage,
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotelById,
  deleteHotelById,
} = require("../controllers/hotelController");

const routes = [
  {
    method: HttpMethods.POST,
    path: "/hotels",
    handlers: [uploadHotelImage, createHotel],
  },
  {
    method: HttpMethods.GET,
    path: "/hotels",
    handlers: [getAllHotels],
  },
  {
    method: HttpMethods.GET,
    path: "/hotels/:hotelId",
    handlers: [getHotelById],
  },
  {
    method: HttpMethods.PUT,
    path: "/hotels/:hotelId",
    handlers: [uploadHotelImage, updateHotelById],
  },
  {
    method: HttpMethods.DELETE,
    path: "/hotels/:hotelId",
    handlers: [deleteHotelById],
  },
];

const router = createRouter(routes);

module.exports = router;
