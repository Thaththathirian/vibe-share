import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find((u) => u.email === email);
    if (user) {
      const isPasswordValid = await bcrypt.compare(
        password,
        user.passwords[user.passwords.length - 1]
      );
      if (isPasswordValid) {
        login(user);
        alert("Login successful");
        navigate("/");
      } else {
        setError("* Invalid email or password");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.95, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0.8, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="login signup-login-cp">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <span>{error}</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span>{error}</span>
          <button type="submit">Login</button>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="link">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
