const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password, role, remember } = req.body;

    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: remember ? "30d" : "1h" }
    );

    const today = new Date().toLocaleDateString('en-CA'); // ✅ Fixed date
    if (!user.streakDates.includes(today)) {
      user.streakDates.push(today);
      await user.save();
    }


    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        institution: user.institution || '',
        phone: user.phone || '',
        country: user.country || '',
        gender: user.gender || '',
        avatar: user.avatar || '1.jpg',
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err); // 👈 Important
    res.status(500).json({ msg: "Server error" });
  }
};

exports.validateToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ msg: "Invalid user" });

    res.json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        institution: user.institution || '',
        phone: user.phone || '',
        country: user.country || '',
        gender: user.gender || '',
        avatar: user.avatar || '1.jpg',
      },
    });
  } catch (err) {
    res.status(401).json({ msg: "Unauthorized or invalid token" });
  }
};



exports.getStreakDates = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    res.json({ streakDates: user.streakDates });
  } catch (err) {
    res.status(401).json({ msg: "Unauthorized or Invalid Token" });
  }
};


exports.changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ msg: "Current password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

