import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ChangePassword from "./ChangePassword";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <nav className="navbar">
        <img
          src="/assets/icons/good-vibes.png"
          alt="vibes icon"
          width="25px"
          height="25px"
        />
        <ul>
          <li>Home</li>
          <li onClick={handleLogout}>Log out</li>
          <li onClick={() => setIsModalOpen(true)}>Change Password</li>
        </ul>
      </nav>
      {isModalOpen && <ChangePassword onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Navbar;
