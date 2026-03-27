import React, { useEffect } from "react";

const Toast = ({ message, type = "success", onClose, duration = 2500 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-purple-600",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg text-white shadow-lg transition-all transform ${colors[type]} animate-slide-in`}
    >
      {message}
    </div>
  );
};

export default Toast;
