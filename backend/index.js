const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.use('/', require('./routes/indexRoutes'));
app.use('/', require('./routes/tripRoutes'));
app.use('/', require('./routes/searchRoutes'));
app.use('/', require('./routes/hotelRoutes'));
app.use('/', require('./routes/topTouristPlaceRoutes'));
app.use('/', require('./routes/chatBotRoutes'));

// HTTP server
const server = http.createServer(app);

// Start server after DB connection
const startServer = async () => {
  await connectDB();

  const PORT = parseInt(process.env.PORT) || 8080;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
