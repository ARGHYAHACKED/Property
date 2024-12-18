import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AddProperty from "./pages/AddProperty";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Property from "./pages/Property";
import Land from "./pages/Land";
import LandDetails from "./pages/LandDetails";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Createuser from "./pages/Createuser";
import SellLand from "./pages/SellLand";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar isLoggedIn={isLoggedIn} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/property" element={<Property />} />
            <Route path="/land" element={<Land />} />
            <Route path="/land/:id" element={<LandDetails />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/property-details/:id" element={<PropertyDetails />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/createuser" element={<Createuser />} />
            <Route
              path="/profile"
              element={
                
                  <Profile onLogout={handleLogout} />
                
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/sell" element={<SellLand />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
