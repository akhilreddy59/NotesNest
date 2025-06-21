// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; //
import NotesList from "./pages/NotesList";
import UploadPage from "./pages/UploadPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<NotesList />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
      <Footer /> {/* 👈 Add this */}
    </Router>
  );
};

export default App;
