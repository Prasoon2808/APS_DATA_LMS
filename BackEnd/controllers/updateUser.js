const User = require("../models/user");
const bcrypt = require("bcrypt");

// Update user details by ID
const updateUser = async (req, res) => {
    const { id, email, password, role } = req.body;

    if (!id) {
      return res.status(400).json({ msg: "User ID is required" });
    }
  
    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      // Conditional updates
      if (email) user.email = email;
      if (role) user.role = role;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
  
      await user.save();
      res.json({ msg: "User updated successfully", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
};

module.exports = updateUser;
