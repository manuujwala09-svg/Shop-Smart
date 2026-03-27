import React from "react";
import { useNavigate } from "react-router-dom";
import SignupForm from "../components/auth/SignupForm";
import toast from "react-hot-toast";

const SignupPage = ({ setUser }) => {
  const navigate = useNavigate();

  const handleSuccess = (userData) => {
    setUser(userData);
    toast.success("Account created successfully!");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <SignupForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default SignupPage;
