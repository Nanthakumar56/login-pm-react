import React from "react";
import { Route, Routes } from "react-router-dom";
import NewPassword from "../components/Loginformfolder/NewPassword";
import LoginForm from "../components/Loginformfolder/Loginform.jsx";
import EmailPage from "../components/Loginformfolder/EmailPage.jsx";
import OtpConfirmation from "../components/Loginformfolder/OtpConfirmation.jsx";

const AllRoutes = () => {
  const Dashboard = React.lazy(() => import("Dashboard/Dashboard"));
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/reset-password" element={<NewPassword />} />
      <Route path="/email-verification" element={<EmailPage />} />
      <Route path="/otp-verification" element={<OtpConfirmation />} />
      <Route path="/project-management" element={<Dashboard />} />
    </Routes>
  );
};

export default AllRoutes;
