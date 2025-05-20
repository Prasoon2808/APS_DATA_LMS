const User = require("../models/user");
const bcrypt = require("bcrypt");

const addUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ msg: "All fields (email, password, role) are required" });
  }

  try {
    // Check for duplicate
    const existing = await User.findOne({ email, role });
    if (existing) {
      return res.status(409).json({ msg: "User with this email and role already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({ msg: "User created successfully", user: { email, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = addUser;
