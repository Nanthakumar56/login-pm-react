import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

const LoginForm = () => {
  const [visible, setVisible] = useState(false);
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedUser = localStorage.getItem("rememberMe") === "true";
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    if (rememberedUser && storedUsername && storedPassword) {
      setFormValues({ username: storedUsername, password: storedPassword });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setRememberMe(checked);
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value.replace(/\s+/g, ""),
      }));
    }
  };

  const handleForgotPassword = (e) => {
    navigate("/email-verification");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5656/api/userLogin",
        formValues
      );

      const token = response.data.token;
      const message = response.data.message;

      if (message === "home") {
        const decodedToken = jwtDecode(token);
        localStorage.setItem("token", token);
        localStorage.setItem("username", decodedToken.sub);
        localStorage.setItem("expiration", decodedToken.exp);

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("username", formValues.username);
          localStorage.setItem("password", formValues.password);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("username");
          localStorage.removeItem("password");
        }

        navigate("/project-management");
      } else if (message === "NewPassword") {
        navigate("/reset-password", { state: { formValues } });
      } else {
        console.error("Unexpected response message:", message);
        setError("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      setFormValues({ username: "", password: "" });
      setError(error.response.data.message);
    }
  };

  return (
    <div className="mt-10 mx-auto xl:w-[450px] lg:w-[430px] md:w-[380px] bg-white  border-gray-200 text-gray-800 rounded-xl p-8 shadow-2xl">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Project Management</h1>
        <h2 className="text-xl font-bold mb-4">Sign In</h2>
        <p className="text-sm font-normal mb-14">
          Log In and Let's Get to Work!
        </p>
        <div className="mb-6">
          {error && <h5 className="text-red-500 text-sm mb-2">{error}</h5>}
          <label className="block mb-2">Username</label>
          <input
            type="text"
            placeholder="Username"
            name="username"
            required
            value={formValues.username}
            onChange={handleChange}
            className="w-full border-b-2 border-gray-300 p-1 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <div className="relative">
            <input
              type={visible ? "text" : "password"}
              name="password"
              required
              placeholder="Password"
              value={formValues.password}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 p-1 focus:outline-none focus:border-blue-500"
            />
            <div
              onClick={() => setVisible(!visible)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {visible ? (
                <IoEyeOutline className="text-xl" />
              ) : (
                <IoEyeOffOutline className="text-xl" />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-10">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleChange}
              className="mr-2"
            />
            Remember me
          </label>
          <a
            className="text-blue-500 font-normal hover:underline"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </a>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white font-medium py-1 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </div>

        <p className="mt-6 text-sm">
          For more information, please review our{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Cookies Statement
          </a>
          .
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
