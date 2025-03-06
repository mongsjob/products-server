const express = require('express');
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

app.use(cors({
  origin: [
      "http://localhost:5174",
      "https://products-admin.onrender.com",
      "https://products-requirements.onrender.com",
      "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true, // ✅ Ensures cookies are sent in cross-origin requests
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"] // ✅ Exposes Authorization header for frontend
}));

// Handle Preflight Requests
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Routes
const infoRoute = require('./src/route/info.route');
const authRoute = require('./src/route/auth.user.route');

app.use('/api/info', infoRoute);
app.use('/api/auth', authRoute);

// Root endpoint (moved outside main())
app.get('/', (req, res) => {
  res.send('Docs running successfully!');
});

// MongoDB Connection
main().then(() => console.log("MongoDB connected successfully")).catch(err => console.log(err));

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully");
    
    // Start the server *after* MongoDB is connected
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

// async function main() {
//   await mongoose.connect(process.env.MONGODB_URL);
// }

// Start Server
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
