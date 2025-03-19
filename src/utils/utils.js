import CryptoJS from "crypto-js";

export const decryptLoggedInUser = () => {
  const loggedInUserData = localStorage.getItem("loggedInUser");
  if (loggedInUserData) {
    try {
      const bytes = CryptoJS.AES.decrypt(
        loggedInUserData,
        import.meta.env.VITE_SECRET_KEY
      );
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error("Error decrypting loggedInUser:", error);
      localStorage.removeItem("loggedInUser"); // Remove corrupted data
    }
  }
  return null;
};
