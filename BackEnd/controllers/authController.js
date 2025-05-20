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

    res.json({
      token,
      user: { email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err); // 👈 Important
    res.status(500).json({ msg: "Server error" });
  }
};
