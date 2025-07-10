const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user'); // Adjust path as needed

const connectDB = async () => {
  await mongoose.connect('mongodb+srv://prasoonSaxena:syncSoul1105@cluster0.gkhlryu.mongodb.net/LMS_DATA');
};

const createUsers = async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash('press@ratlab', 10);

  await User.create([
    { email: 'press.ratlab@gmail.com', password: hashedPassword, role: 'student' },
    { email: 'press.ratlab@gmail.com', password: hashedPassword, role: 'faculty' },
    { email: 'press.ratlab@gmail.com', password: hashedPassword, role: 'admin' }
  ]);

  console.log('Users seeded successfully');
  process.exit();
};

createUsers();
