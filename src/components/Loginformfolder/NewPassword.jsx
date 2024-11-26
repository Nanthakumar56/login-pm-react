import React, { useState } from "react";
import { FiCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { HiXMark } from "react-icons/hi2";
import { HiCheck } from "react-icons/hi";
import { IoChevronBackCircleOutline } from "react-icons/io5";

function NewPassword() {
  const [password, setPassword] = useState("");
  const [upperValidate, setUpperValidate] = useState(false);
  const [lowerValidate, setLowerValidate] = useState(false);
  const [numberValidate, setNumberValidate] = useState(false);
  const [specialValidate, setSpecialValidate] = useState(false);
  const [lengthValidate, setLengthValidate] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const [showError, setShowError] = useState(false);
  const [visible, setVisible] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitStatus, setSubmitStatus] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const formValues = location.state?.formValues || {};
  const username = formValues.username;
  const emailValue = location.state?.email || "";

  const handleChange = (e) => {
    const value = e.target.value.replace(/\s+/g, "");
    setPassword(value);

    const upper = new RegExp("(?=.*[A-Z])");
    const lower = new RegExp("(?=.*[a-z])");
    const number = new RegExp("(?=.*[0-9])");
    const special = new RegExp("(?=.*[!@#\\$%\\^&\\*])");
    const length = new RegExp("(?=.{8,})");

    const isUpperValid = upper.test(value);
    const isLowerValid = lower.test(value);
    const isNumberValid = number.test(value);
    const isSpecialValid = special.test(value);
    const isLengthValid = length.test(value);

    setUpperValidate(isUpperValid);
    setLowerValidate(isLowerValid);
    setNumberValidate(isNumberValid);
    setSpecialValidate(isSpecialValid);
    setLengthValidate(isLengthValid);

    if (
      isUpperValid &&
      isLowerValid &&
      isNumberValid &&
      isSpecialValid &&
      isLengthValid
    ) {
      setShowTracker(false);
      setVisible(true);
    } else {
      setShowTracker(true);
      setVisible(false);
    }
  };

  const handleConfirmChange = (e) => {
    const value = e.target.value.replace(/\s+/g, "");
    setConfirmPassword(value);
    setPasswordMatch(value === password);
  };

  const handleConfirmFocus = (e) => {
    handleConfirmChange(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
  };

  const handleCopy = (e) => {
    e.preventDefault();
  };

  const handleBlur = () => {
    if (
      !upperValidate ||
      !lowerValidate ||
      !numberValidate ||
      !specialValidate ||
      !lengthValidate
    ) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !upperValidate ||
      !lowerValidate ||
      !numberValidate ||
      !specialValidate ||
      !lengthValidate ||
      !passwordMatch
    ) {
      setShowError(true);
      setSubmitStatus(true);
      console.log("Error: Validation failed");
    } else {
      setSubmitStatus(false);
      const data = { username, password, email: emailValue };
      try {
        const response = await axios.post(
          "http://localhost:5656/api/updatePassword",
          data
        );
      } catch (error) {
        console.error("There was an error updating the password!", error);
      }
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="mt-5 xl:w-[450px] lg:w-[430px] md:w-[380px] bg-white  border-gray-300 text-[#1A2733] rounded-xl p-10 shadow-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <button onClick={hanldeBack}>
            <span>
              <IoChevronBackCircleOutline className="text-gray-500 font-semibold text-3xl" />
            </span>
          </button>
          <h1 className="text-lg font-bold mb-8">Project Management</h1>
          <h2 className="text-2xl font-extrabold mb-2">New Password</h2>
          <p className="text-sm mb-8">
            Let's Make Your Account Even Safer - Create a New Password
          </p>
          {submitStatus && (
            <h5 className="text-red-500 mb-4 text-sm">
              Error changing password! Please check for password mismatching.
            </h5>
          )}
          <div className="mb-4">
            <label className="block text-base mb-1">New password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full border-b-2 border-gray-300 p-1 focus:outline-none focus:border-blue-500"
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
              />
              {visible && (
                <HiCheck className="absolute top-1/2 right-3 transform -translate-y-1/2 text-green-500" />
              )}
            </div>
            {showTracker && (
              <div className="mt-2">
                {[
                  {
                    valid: upperValidate,
                    message: "At least one uppercase letter",
                  },
                  {
                    valid: lowerValidate,
                    message: "At least one lowercase letter",
                  },
                  { valid: numberValidate, message: "At least one number" },
                  {
                    valid: specialValidate,
                    message: "At least one special character",
                  },
                  { valid: lengthValidate, message: "At least 8 characters" },
                ].map((rule, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${
                      rule.valid
                        ? "text-green-500"
                        : showError
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {rule.valid ? (
                      <FiCheckCircle />
                    ) : showError ? (
                      <FiXCircle />
                    ) : (
                      <FiCircle />
                    )}
                    <span className="ml-2">{rule.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-base mb-1">Confirm new password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Password"
                className="w-full border-b-2 border-gray-300 p-1 focus:outline-none focus:border-blue-500"
                onChange={handleConfirmChange}
                onKeyDown={handleKeyDown}
              />
              {confirmPassword &&
                passwordMatch !== null &&
                (passwordMatch ? (
                  <HiCheck className="absolute top-1/2 right-3 transform -translate-y-1/2 text-green-500" />
                ) : (
                  <HiXMark className="absolute top-1/2 right-3 transform -translate-y-1/2 text-red-500" />
                ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 mt-10 text-white font-medium py-1 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewPassword;
