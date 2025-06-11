import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./resetPassword.css"; // Add your CSS file for styling
import { assets } from "../../../assets/assets";
import NavbarWhite from "../../../Component/Navbar/NavbarWhite";
import config from "../../../config/config";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      return setMsg('"Err: Passwords do not match"');
    }

    try {
      const res = await axios.post(`${config.backendUrl}/api/auth/reset-password`, {
        token,
        newPassword: newPass
      });
      toast.error(res.data.msg);
      navigate("/");
    } catch (err) {
        toast.error(err.response?.data?.msg || "Reset failed.");
        if (err.response?.status === 401 || err.response?.status === 400) {
          navigate("/"); // redirect to login on token expiry
        }
      }
  };

  return (
    <div className="reset-page">
        <NavbarWhite/>
        <div className="main">  
            <img src={assets.APSbg} alt="" />
            <h1>Parameters.<br />Algorithms.<br />Logics</h1>
            <div className="glass-container">
                <h2>Reset Password</h2>
                <form onSubmit={handleReset}>
                    <input type="password" placeholder="New Password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required />
                    <input type="password" placeholder="Confirm Password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required />
                    <button className='loginBtn' type="submit">Save Password</button>
                </form>
                <p className="error">{msg}</p>
            </div>
        </div>
    </div>
  );
};

export default ResetPassword;
