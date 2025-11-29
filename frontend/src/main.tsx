import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'

import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ApplicantDashboard } from "./pages/ApplicantDashboard";
import { AdminResultsPage } from "./pages/AdminResultsPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/results/:jobId" element={<AdminResultsPage />} />

        <Route path="/applicant" element={<ApplicantDashboard />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);