import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./store/UserStore.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Authentication/Login";
import Home from "./components/Home/Home";
import Register from "./components/Authentication/Register";
import Queue from "./components/Queue/Queue.jsx";
import { useVideo } from "./store/VideoStore.js";

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
  const { isAuthChecking, getUser, user } = useUser();
  const { getQueue, getLibrary } = useVideo();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getQueue();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getLibrary();
    }
  }, [user]);

  if (isAuthChecking) return <div className="h-screen bg-[#0a0a0a]"></div>;

  return (
    <div className="h-screen bg-[#0a0a0a] text-white select-none">
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
        <Route
          path="/queue"
          element={
            <ProtectAuthenticatedRoutes>
              <Queue />
            </ProtectAuthenticatedRoutes>
          }
        />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
