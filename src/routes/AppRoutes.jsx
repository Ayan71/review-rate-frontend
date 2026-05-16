import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import CompanyDetails from "../pages/CompanyDetails/CompanyDetails";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ProtectedRoute from "../api/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company/:id"
        element={
          <ProtectedRoute>
            <CompanyDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;