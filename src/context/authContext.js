import axios from "axios";
import { useCart } from "./cartContext";

export const useAuth = () => {
  const { setCart, setUser } = useCart(); // reset cart + user

  const logout = async () => {
    try {
      // tell backend to clear cookie
      await axios.post(
        "http://localhost:5001/api/auth/logout",
        {},
        { withCredentials: true } // important: send cookie
      );

      // reset frontend state
      setCart([]);
      setUser(null);
      localStorage.removeItem("user");

      console.log("✅ Logged out successfully");
    } catch (err) {
      console.error("❌ Logout failed:", err.response?.data || err);
    }
  };

  return { logout };
};
