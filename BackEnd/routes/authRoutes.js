const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");
const updateUser = require("../controllers/updateUser");
const addUser = require("../controllers/addUser");

router.post("/add", addUser);
// PUT /api/auth/update/:id
router.put("/update/:id", updateUser);

router.post("/login", login);

module.exports = router;
