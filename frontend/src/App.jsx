import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/HomeModern";
import AddProperty from "./pages/AddProperty";
import AddLand from "./pages/AddLand";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Property from "./pages/Property";
import Land from "./pages/Land";
import LandDetails from "./pages/LandDetails";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import AdminOverview from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminProperties from "./pages/admin/Properties";
import AdminLands from "./pages/admin/Lands";
import AdminMessages from "./pages/admin/Messages";
import AdminRequests from "./pages/admin/Requests";
import AdminMarketing from "./pages/admin/Marketing";
import AdminBannerManagement from "./pages/admin/BannerManagement";
import Createuser from "./pages/Createuser";
import SellLand from "./pages/SellLand";
import LeadPopup from "./components/LeadPopup";
import AdminLeads from "./pages/admin/Leads";
import EditProperty from "./pages/admin/EditProperty";
import EditLand from "./pages/admin/EditLand";
import CustomCursor from "./components/CustomCursor";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token") || Cookies.get("token");
    const adminToken = localStorage.getItem("adminToken") || Cookies.get("adminToken");
    setIsLoggedIn(!!token);
    setIsAdminLoggedIn(!!adminToken);
    
    // Global scroll-to-top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAdminPath = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    setIsLoggedIn(false);
  };

  const UserProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token") || Cookies.get("token");
    return token ? children : <Navigate to="/login" replace />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <CustomCursor />
      {!isAdminPath && <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdminLoggedIn} />}
      {!isAdminPath && <LeadPopup />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property" element={<Property />} />
          <Route path="/land" element={<Land />} />
          <Route path="/land/:id" element={<LandDetails />} />
          <Route path="/land-details/:id" element={<LandDetails />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/add-land" element={<AddLand />} />
          <Route path="/property-details/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/createuser" element={<Createuser />} />
          <Route
            path="/profile"
            element={
              <UserProtectedRoute>
                <Profile onLogout={handleLogout} />
              </UserProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/sell" element={<SellLand />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="user" element={<AdminUsers />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="lands" element={<AdminLands />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="marketing" element={<AdminMarketing />} />
            <Route path="marketing/webbanner" element={<AdminBannerManagement />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="edit-property/:id" element={<EditProperty />} />
            <Route path="edit-land/:id" element={<EditLand />} />
          </Route>
        </Routes>
      </div>
      {!isAdminPath && <Footer />}
    </div>
  );
};

export default App;
