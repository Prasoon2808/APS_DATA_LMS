const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user'); // Adjust path as needed

const connectDB = async () => {
  await mongoose.connect('mongodb+srv://prasoonSaxena:syncSoul1105@cluster0.gkhlryu.mongodb.net/?');
};

const createUsers = async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash('Admin@2020', 10);

  await User.create([
    { email: 'student1@example.com', password: hashedPassword, role: 'student' },
    { email: 'faculty1@example.com', password: hashedPassword, role: 'faculty' },
    { email: 'admin1@example.com', password: hashedPassword, role: 'admin' }
  ]);

  console.log('Users seeded successfully');
  process.exit();
};

createUsers();
