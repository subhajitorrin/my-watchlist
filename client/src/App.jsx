import React from "react";
import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useUser } from "./store/UserStore.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Authentication/Login";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar";
import Register from "./components/Authentication/Register";

function ProtectUnauthenticatedRoutes({ children }) {
  const { isAuthenticated } = useUser();
  if (isAuthenticated === true) {
    return <Navigate to="/home" />;
  }
  return children;
}

function ProtectAuthenticatedRoutes({ children }) {
  const { isAuthenticated } = useUser();
  if (isAuthenticated === false) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  const { isAuthChecking } = useUser();
  const location = useLocation();
  const shouldNotShowNavbar =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");

  if (isAuthChecking) return <div className="h-screen bg-[#0a0a0a]"></div>;

  return (
    <div className="h-screen bg-[#0a0a0a] text-white select-none">
      {!shouldNotShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to={"/home"} />} />
        <Route
          path="/login"
          element={
            <ProtectUnauthenticatedRoutes>
              <Login />
            </ProtectUnauthenticatedRoutes>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectUnauthenticatedRoutes>
              <Register />
            </ProtectUnauthenticatedRoutes>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectAuthenticatedRoutes>
              <Home />
            </ProtectAuthenticatedRoutes>
          }
        />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
