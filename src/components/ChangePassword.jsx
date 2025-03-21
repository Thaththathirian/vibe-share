import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import { decryptLoggedInUser } from "../utils/utils";
import {
  validatePassword,
  validateConfirmPassword,
  getPasswordErrorMessage,
} from "../utils/passwordUtils";
import { motion } from "framer-motion";

const ChangePassword = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const loggedInUser = decryptLoggedInUser();

    if (!loggedInUser) {
      alert("No login found, Please Login");
      return;
    }

    const userIndex = users.findIndex((u) => u.email === loggedInUser.email);
    const user = users[userIndex];

    // new password validation
    if (!validatePassword(newPassword)) {
      setPasswordError(getPasswordErrorMessage());
      return;
    } else {
      setPasswordError("");
    }

    // new & confirm pswd matching
    if (!validateConfirmPassword(newPassword, confirmPassword)) {
      setConfirmPasswordError("Passwords do not match");
      return;
    } else {
      setConfirmPasswordError("");
    }

    // If old pswd matched
    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      user.passwords[user.passwords.length - 1]
    );
    if (!isOldPasswordValid) {
      setOldPasswordError("* Old Password is incorrect");
      return;
    }

    // If new pswd matched last 3 old pswd
    const lastThreePasswords = user.passwords.slice(-3);
    const isNewPasswordValid = await Promise.all(
      lastThreePasswords.map((p) => bcrypt.compare(newPassword, p))
    );
    if (isNewPasswordValid.some((valid) => valid)) {
      alert("New password cannot be the same as the last 3 used passwords");
      return;
    }

    // hash new pswrd
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Keep only last 3 pswd
    user.passwords.push(hashedPassword);
    if (user.passwords.length > 3) {
      user.passwords.shift();
    }

    users[userIndex] = user;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    alert("Password changed succefully");
    onClose();
  };

  return (
    <div className="change-password signup-login-cp">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
        <div className="cp-modal-content" ref={modalRef}>
          <form onSubmit={handleChangePassword}>
            <h1>Change Password</h1>
            <input
              type="password"
              placeholder="Enter Old Password"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                if (e.target.value === "") {
                  setOldPasswordError("");
                }
              }}
              required
            />
            <span>{oldPasswordError}</span>
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span>{passwordError}</span>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (e.target.value === "") {
                  setConfirmPasswordError("");
                }
              }}
              required
            />
            <span>{confirmPasswordError}</span>
            <div>
              <button type="submit">Submit</button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </div>

            <p>
              Forgot password?{" "}
              <Link to="#" className="link">
                Click here
              </Link>
            </p>
          </form>
        </div>
    </motion.div>
      </div>
  );
};

export default ChangePassword;
