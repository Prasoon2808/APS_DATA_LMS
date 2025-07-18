const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user'); // Adjust path as needed

const connectDB = async () => {
  await mongoose.connect('mongodb+srv://prasoonSaxena:syncSoul1105@cluster0.gkhlryu.mongodb.net/LMS_DATA');
};

const createUsers = async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash('RLEDU#Admin@2025', 10);

  await User.create([
      { email: 'prasoon.saxena@edu-lab.in', password: hashedPassword, role: 'smartLABS' },
  ]);

  console.log('Users seeded successfully');
  process.exit();
};

createUsers();
