import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import toast from "react-hot-toast";

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

  const handleSuccess = (userData) => {
    setUser(userData);
    toast.success("Logged in successfully!");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default LoginPage;
