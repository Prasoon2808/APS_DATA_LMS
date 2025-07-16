const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const notebookRoutes = require("./routes/notebookRoutes");
const courseRoutes = require("./routes/courseRoutes");
const emailOtpRoutes = require("./routes/emailOtpRoutes");
const waitlistRoutes = require("./routes/waitlistRoutes");
const referralDemoRoute = require("./routes/referralDemoRoutes");
const waitlistDemoRoutes = require("./routes/waitlistDemoRoutes");
const faqRoutes = require("./routes/FAQRoutes");
const qnaRoutes = require("./routes/qnaRoutes");
const emailRoutes = require("./routes/emailRoutes");
const eventRoutes = require("./routes/eventMeta");
const blogRoutes = require("./routes/BlogRoutes");

// Load environment variables & connect DB
dotenv.config();
connectDB();

const app = express();

// CORS configuration
const allowedOrigins = [
  'https://edu-lab.in',
  'https://www.edu-lab.in',
  'http://localhost:5173',
  'https://edu-lab.co.in'
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middlewares
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

// API Routes
app.use("/api/auth", authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', emailOtpRoutes);
app.use('/api', waitlistRoutes);
app.use('/api', referralDemoRoute);
app.use('/api', waitlistDemoRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/notebook', notebookRoutes);
app.use('/api/qna', qnaRoutes);
app.use('/api', emailRoutes);
app.use('/api/event', require('./routes/event'));
app.use('/api/event-meta', eventRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/forum', require('./routes/forumRoutes'));

// Health check
app.get('/', (req, res) => {
  res.send('APS Backend API is working!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => 
  console.log(`Server running on port ${PORT}`)
);
