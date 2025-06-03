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
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

app.use("/api/auth", authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', emailOtpRoutes);
app.use('/api', waitlistRoutes);
app.use('/api', referralDemoRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
