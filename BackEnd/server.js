// mongodb+srv://prasoonSaxena:syncSoul1105@cluster0.gkhlryu.mongodb.net/?
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const path = require('path');
const courseRoutes = require('./routes/courseRoutes');
const emailOtpRoutes = require('./routes/emailOtpRoutes');
const waitlistRoutes = require('./routes/waitlistRoutes');
const referralDemoRoute = require('./routes/referralDemoRoutes');

dotenv.config();
connectDB();

const app = express();
const allowedOrigins = ['https://edu-lab.in', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

app.use("/api/auth", authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', emailOtpRoutes);
app.use('/api', waitlistRoutes);
app.use('/api', referralDemoRoute);
const path = require('path');

// Serve static files from React build folder
app.use(express.static(path.join(__dirname, 'FrontEnd', 'dist')));

// Catch-all route to serve React's index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'FrontEnd', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
