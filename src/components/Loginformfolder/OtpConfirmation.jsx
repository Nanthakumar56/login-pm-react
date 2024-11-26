import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { IoChevronBackCircleOutline } from "react-icons/io5";

const OtpConfirmation = () => {
  const initialTimer = parseInt(localStorage.getItem("timer") ?? 60, 10);
  const [newOtp, setNewOtp] = useState("");
  const [otpForm, setOtpForm] = useState({ email: "", otp: "" });
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(initialTimer);
  const [canResend, setCanResend] = useState(false);
  const [visible, setVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const emailValue = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5656/api/verifyOtp",
        otpForm
      );
      if (response.data === "success") {
        navigate("/reset-password", { state: { email: emailValue } });
      }
    } catch (error) {
      setError("Incorrect OTP! Please enter valid OTP.");
    }
  };

  const countTimer = useCallback(() => {
    if (timer <= 0) {
      localStorage.removeItem("timer");
      setCanResend(true);
      setVisible(false);
    } else {
      setTimer(timer - 1);
    }
  }, [timer]);

  const handleChange = (e) => {
    const { value } = e.target;
    setNewOtp(value);
    setOtpForm((prevState) => ({
      ...prevState,
      otp: value,
    }));
  };

  const handleResendOtp = async () => {
    try {
      axios.post("http://localhost:5656/api/sendOtp", {
        email: emailValue,
      });
      setTimer(60);
      setNewOtp("");
      setCanResend(false);
      setVisible(true);
    } catch (error) {
      console.error("There was an error resending the OTP!", error);
    }
  };

  useEffect(() => {
    const timerId = setInterval(countTimer, 1000);
    return () => clearInterval(timerId);
  }, [countTimer]);

  useEffect(() => {
    localStorage.setItem("timer", timer);
  }, [timer]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("timer");
    };
  }, []);

  useEffect(() => {
    setOtpForm((prevState) => ({
      ...prevState,
      email: emailValue,
    }));
  }, [emailValue]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="mt-10 xl:w-[450px] lg:w-[430px] md:w-[380px] bg-white  border-gray-300 text-[#1A2733] rounded-xl p-10 shadow-2xl mx-auto">
        <form className="text-sm " onSubmit={handleSubmit}>
          <button onClick={hanldeBack}>
            <span>
              <IoChevronBackCircleOutline className="text-gray-500 font-semibold text-3xl" />
            </span>
          </button>
          <h1 className="text-2xl font-bold mb-4">Project Management</h1>
          <h2 className="text-xl font-semibold mb-2">Enter OTP</h2>
          <p className="text-sm mb-6">
            Verify Your Identity with a One-Time Password. Enter OTP to change
            password!
          </p>
          {error && <h5 className="text-red-500 mb-2">{error}</h5>}
          <div className="mb-4">
            <label className="block text-base mb-1">Enter OTP</label>
            <input
              type="text"
              placeholder="e.g. 000000"
              name="otp"
              required
              value={newOtp}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 p-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <h4 className={visible ? "text-sm" : "invisible"}>
              OTP expires in: {Math.floor(timer / 60)}:
              {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
            </h4>
            <button
              className={`text-blue-500  ${
                !canResend ? "text-gray-400" : "text-blue-500"
              }`}
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend}
            >
              Resend OTP
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 mt-10 text-white font-medium py-1 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpConfirmation;
