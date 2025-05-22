const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");

const sendResetLink = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Email not registered" });

    user.resetTokenUsed = false;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"RatLab Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password - RatLab LMS",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
            <p>Dear User,</p>
            <p>You requested to reset your password for your RatLab LMS account.</p>

            <table cellspacing="0" cellpadding="0"> 
            <tr>
                <td align="center" bgcolor="#007BFF" style="border-radius: 5px;">
                <a href="${resetLink}"
                    target="_blank"
                    style="display: inline-block; 
                            padding: 12px 20px; 
                            font-size: 16px; 
                            color: #ffffff; 
                            text-decoration: none; 
                            border-radius: 5px;
                            font-weight: bold;
                            cursor: pointer;">
                    Reset your Password
                </a>
                </td>
            </tr>
            </table>

            <p>This link will expire in 15 minutes.</p>
            <p style="color: red; ">Note: Make sure that this email is in your inbox and not in spam to access the above link. If it is in spam folder then click on "Not Spam" to transfer it in your inbox.</p>
            <p style="font-size: 13px; color: gray;">This is a system-generated email. Please do not reply.</p>
            <p style="font-weight: bold;">– RatLab Team</p>
        </div>
        `,
      headers: {
        "X-Priority": "1 (Highest)",
        "X-Mailer": "RatLab LMS Mailer",
        "X-MSMail-Priority": "High",
        "Importance": "high"
      }
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: "Reset link sent to your email (Check in your spam)" });

  } catch (err) {
    console.error("Send Reset Link Error:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = sendResetLink;
