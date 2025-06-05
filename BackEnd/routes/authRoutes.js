const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");
const updateUser = require("../controllers/updateUser");
const addUser = require("../controllers/addUser");
const sendResetLink = require("../controllers/sendResetLink");
const resetPassword = require("../controllers/resetPassword");

router.post("/forgot-password", sendResetLink);
router.post("/reset-password", resetPassword);

router.post("/add", addUser);
// PUT /api/auth/update/:id
router.put("/update/:id", updateUser);

router.post("/login", login);
const { getStreakDates } = require("../controllers/authController");
router.get("/streak-dates", getStreakDates);


module.exports = router;
