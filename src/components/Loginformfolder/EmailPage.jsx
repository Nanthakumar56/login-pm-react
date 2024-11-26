import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { IoChevronBackCircleOutline } from "react-icons/io5";

const EmailPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios.post("http://localhost:5656/api/sendOtp", { email });
      navigate("/otp-verification", { state: { email } });
    } catch (error) {
      console.error("There was an error sending the OTP!", error);
    }
  };

  const hanldeBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="mt-10 xl:w-[450px] lg:w-[430px] md:w-[380px] bg-white  border-gray-300 text-[#1A2733] rounded-xl p-10 shadow-2xl mx-auto">
        <button onClick={hanldeBack}>
          <span>
            <IoChevronBackCircleOutline className="text-gray-500 font-semibold text-3xl" />
          </span>
        </button>
        <form onSubmit={handleSubmit}>
          <h1 className="text-xl pb-5">Project Management</h1>
          <h2 className="text-2xl font-bold leading-relaxed pb-2">
            Forgot Password
          </h2>
          <p className="text-sm leading-6 pb-10">
            Trouble Logging In? Enter Your Email Address, and We'll Assist You
            in Creating a New Password.
          </p>
          <div className="mb-8">
            <label className="block text-base leading-6 mb-2 text-[#131313]">
              Registered Email Address
            </label>
            <input
              type="email"
              placeholder="your.email@example.com"
              name="email"
              required
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 p-1 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              className="mt-10 py-1 px-4 rounded-lg border border-blue-500 bg-blue-500 text-white font-medium hover:bg-blue-600"
              type="submit"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailPage;
