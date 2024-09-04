import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route
          path="/login"
          element={
            <GoogleOAuthProvider clientId={import.meta.env.VITE_client_id}>
              <Login />
            </GoogleOAuthProvider>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
