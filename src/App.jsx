import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./features/auth/authSlice";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ContactList from "./pages/ContactList";
import AddEditContact from "./pages/AddEditContact";
import ProtectedRoutes from "./components/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const authLoading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Checking authentication...
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/contacts"
            element={
              <ProtectedRoutes authStatus={authStatus}>
                <ContactList />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/add-contact"
            element={
              <ProtectedRoutes>
                <AddEditContact />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/edit-contact/:id"
            element={
              <ProtectedRoutes authStatus={authStatus}>
                <AddEditContact />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
