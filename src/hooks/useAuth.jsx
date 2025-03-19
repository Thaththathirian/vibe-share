import { createContext, useContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const encryptedUser = localStorage.getItem("loggedInUser");
    if (encryptedUser) {
      try {
        const bytes = CryptoJS.AES.decrypt(
          encryptedUser,
          import.meta.env.VITE_SECRET_KEY
        );
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        if (decryptedText) {
          const decryptedUser = JSON.parse(decryptedText);
          setUser(decryptedUser);
        }
      } catch (error) {
        console.error("Error decrypting user data:", error);
        localStorage.removeItem("loggedInUser");
      }
    }
  }, []);

  const login = (userData) => {
    try {
      const encryptedUser = CryptoJS.AES.encrypt(
        JSON.stringify(userData),
        import.meta.env.VITE_SECRET_KEY
      ).toString();
      localStorage.setItem("loggedInUser", encryptedUser);
      setUser(userData);
    } catch (error) {
      console.error("Error decrypting user data:", error);
    }
  };
  const logout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
