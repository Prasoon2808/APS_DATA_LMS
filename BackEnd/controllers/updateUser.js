const User = require("../models/user");
const bcrypt = require("bcrypt");

const updateUser = async (req, res) => {
  const id = req.params.id;

  if (!id) return res.status(400).json({ msg: "User ID is required" });

  const {
    name,
    phone,
    gender,
    country,
    institution,
    avatar,
    email,
    role,
    password
  } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Optional: debug log incoming data
    console.log("Updating User:", { id, name, phone, avatar });

    if (email) user.email = email;
    if (role) user.role = role;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (country) user.country = country;
    if (institution) user.institution = institution;
    if (avatar) user.avatar = avatar;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ msg: "User updated successfully", user });
  } catch (err) {
    console.error("Update Error:", err); // Full error
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = updateUser;
