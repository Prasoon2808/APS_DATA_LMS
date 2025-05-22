const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // ✅ This will throw if token is expired or invalid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.resetTokenUsed) {
      return res.status(403).json({ msg: "This reset link has already been used." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetTokenUsed = true;
    await user.save();

    return res.json({ msg: "Password reset successful" });

  } catch (err) {
    // ✅ Catch token expiry or malformed token
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Reset link expired. Please request a new one." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ msg: "Invalid reset token." });
    }
    console.error("Reset Password Error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = resetPassword;
