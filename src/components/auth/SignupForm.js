import React, { useState } from "react";
import API from "../../api";

const SignupForm = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !phone || !email || !password)
      return setMessage("All fields required");

    // simple strength check
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!strong.test(password))
      return setMessage(
        "Password must be strong (8+ chars, upper, lower, number, symbol)"
      );

    try {
      setLoading(true);
      const { data } = await API.post("/signup", {
        username,
        phone,
        email,
        password,
      });
      localStorage.setItem("user", JSON.stringify(data.user));
      onSuccess(data.user);
      setMessage("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Create Account
      </h2>
      {message && <div className="mb-4 text-sm text-red-600">{message}</div>}

      <form onSubmit={handleSignup} className="space-y-4 w-full">
        <input
          type="text"
          placeholder="Full Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400"
        />
        <input
          type="password"
          placeholder="Strong Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
