import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import CompanyDetails from "../pages/CompanyDetails/CompanyDetails";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/company/:id" element={<CompanyDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AppRoutes;
