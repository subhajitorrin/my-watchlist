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
import Collection from "./components/categories/Collection.jsx";
import { useWidth } from "./store/useWIdth.js";

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
  const { setInnerWidth } = useWidth((state) => ({
    setInnerWidth: state.setInnerWidth
  }));

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

  useEffect(() => {
    function handleResize(e) {
      setInnerWidth(e.target.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
        <Route
          path="/collection"
          element={
            <ProtectAuthenticatedRoutes>
              <Collection />
            </ProtectAuthenticatedRoutes>
          }
        />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
      />
    </div>
  );
}

export default App;
