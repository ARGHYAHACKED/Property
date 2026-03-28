import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import API_BASE_URL from '../config/api';

const Profile = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("token") || localStorage.getItem("token");
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        
        const data = await response.json();
        
        if (!data || !data.user) {
           throw new Error("Invalid profile data");
        }
        
        setUser(data.user);
      } catch (error) {
        console.error("Profile fetch error:", error);
        localStorage.removeItem("token");
        Cookies.remove("token");
        onLogout?.();
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, onLogout]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    Cookies.remove("token");
    onLogout?.();
    navigate("/login", { replace: true });
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white font-black uppercase tracking-widest animate-pulse">Loading Profile...</div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white p-12 border-t-8 border-black text-black font-black uppercase tracking-tighter text-2xl">
        No profile data available.
        <button onClick={() => navigate("/login")} className="block mt-8 w-full bg-black text-white py-4 text-sm font-black uppercase tracking-widest">Login</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-16 border-b-8 border-white pb-8">
          User <span className="bg-white text-black px-2">Profile</span>
        </h1>
        
        <div className="bg-white p-12 rounded-none shadow-2xl border-t-8 border-black transform transition duration-500 hover:scale-[1.02]">
          <div className="space-y-8">
            <div className="border-b-4 border-black pb-4">
              <label className="block text-gray-500 font-bold uppercase tracking-widest text-xs mb-1">Full Name</label>
              <p className="text-3xl font-black text-black uppercase tracking-tighter">{user.name}</p>
            </div>
            
            <div className="border-b-4 border-black pb-4">
              <label className="block text-gray-500 font-bold uppercase tracking-widest text-xs mb-1">Email Address</label>
              <p className="text-xl font-bold text-black uppercase tracking-tight break-all">{user.email}</p>
            </div>
            
            <div className="border-b-4 border-black pb-4">
              <label className="block text-gray-500 font-bold uppercase tracking-widest text-xs mb-1">Phone Number</label>
              <p className="text-xl font-bold text-black uppercase tracking-tight">{user.phone}</p>
            </div>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row gap-6">
            <button
              onClick={handleLogout}
              className="px-10 py-5 bg-black text-white font-black uppercase tracking-widest hover:bg-red-600 transition-all transform hover:scale-105"
            >
              Sign Out
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest border-4 border-black hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
