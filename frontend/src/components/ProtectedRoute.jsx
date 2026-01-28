import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdminToken = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard`, {
          withCredentials: true
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.log('Admin not authenticated:', error.message);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAdminToken();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
