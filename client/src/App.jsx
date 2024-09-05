import React from "react";
import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Authentication/Login";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar";
import Register from "./components/Authentication/Register";

function App() {
  const location = useLocation();
  const shouldNotShowNavbar =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");
  return (
    <div className="h-screen bg-[#0a0a0a] text-white select-none">
      {!shouldNotShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
