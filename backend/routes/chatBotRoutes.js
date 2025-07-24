const { createRouter } = require("../utils/routerHelper");
const HttpMethods = require("../utils/httpMethods");

const { chatbotHandler } = require("../controllers/chatbotController");

const routes = [
  {
    method: HttpMethods.POST,
    path: "/chatbot",
    handlers: [chatbotHandler],
  }
];

const router = createRouter(routes);

module.exports = router;
