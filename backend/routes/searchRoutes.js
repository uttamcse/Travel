const { createRouter } = require("../utils/routerHelper");
const HttpMethods = require("../utils/httpMethods");
const { searchTripsByCity } = require("../controllers/search");

const routes = [
  {
    method: HttpMethods.GET,
    path: "/search",
    handlers: [searchTripsByCity],
  },
];

const router = createRouter(routes);

module.exports = router;
