import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import { useAuth } from "../hooks/useAuth";
import {
  validatePassword,
  validateConfirmPassword,
  getPasswordErrorMessage,
} from "../utils/passwordUtils";
import { motion } from "framer-motion";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmpasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validatation pswrd
    if (!validatePassword(password)) {
      setPasswordError(getPasswordErrorMessage());
      return;
    } else {
      setPasswordError("");
    }

    // passwords match
    if (!validateConfirmPassword(password, confirmPassword)) {
      setConfirmPasswordError("Passwords do not match");
      return;
    } else {
      setConfirmPasswordError("");
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      alert("User already exists. Please login.");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { username, email, passwords: [hashedPassword] };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      login(newUser);
      alert("Signup Successfully!");
      navigate("/");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.95, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0.8, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="signup signup-login-cp">
        <form onSubmit={handleSignup}>
          <h1>Signup</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <span></span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <span></span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span>{passwordError}</span>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span>{confirmpasswordError}</span>
          <button type="submit">Signup</button>
          <p>
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login
            </Link>
          </p>
        </form>
      </div>
    </motion.div>
  );
};

export default Signup;
