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
        const token = Cookies.get("token");
        console.log(token)
        if (!token) {
          navigate("/login");
          console.log("profile")
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // if (!response.ok) {
        //   throw new Error("Failed to fetch profile");
        // }
        const data = await response.json();
        console.log(data);
        setUser(data.user);
      } catch (error) {
        // console.error("Error fetching profile:", error);
        console.log(error.message)
        // navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No profile data available.</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profile Details</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        {/* <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p> */}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
