import React, { useRef } from "react";

const OtpInput = ({ length = 6, value, onChange }) => {
  const inputs = useRef([]);

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/, ""); // only numbers
    if (!val && index > 0 && e.nativeEvent.inputType === "deleteContentBackward") {
      inputs.current[index - 1].focus();
    } else if (val && index < length - 1) {
      inputs.current[index + 1].focus();
    }
    const newOtp = value.split("");
    newOtp[index] = val;
    onChange(newOtp.join(""));
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, length);
    onChange(pasted);
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e)}
          onPaste={handlePaste}
          ref={(el) => (inputs.current[i] = el)}
          className="w-10 h-12 text-center border border-purple-300 rounded-lg text-lg font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
        />
      ))}
    </div>
  );
};

export default OtpInput;
