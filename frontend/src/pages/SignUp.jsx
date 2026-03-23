import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import API_BASE_URL from '../config/api';

const SignUp = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
 
  const [error, setError] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const navigate = useNavigate();

  // Check if a valid token exists when the component mounts
  useEffect(() => {
    const token = Cookies.get("token"); // Or localStorage.getItem('token') if you store it in localStorage

    if (token) {
      // If token exists, redirect to homepage
      navigate("/profile"); // Redirect to homepage
    }
  }, [navigate]); // Dependency on navigate to ensure it's checked when component mounts

  const handleMobileSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send API request to register user and generate OTP
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        phone: mobile,
      });

      // Open OTP modal
      setIsOtpModalOpen(true);
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpVerification = async () => {
    try {
      // Send API request to verify OTP
      const response = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
        phone: mobile,
        otp,
      });

      // Extract user ID from the response
      const { id: userId } = response.data.user;
      console.log("OTP verified successfully! User ID:", userId);

      // Store userId in a cookie
      Cookies.set("userId", userId, { expires: 7 }); // Cookie expires in 7 days

      // Navigate to CreateUser page
      navigate("/createuser");
    } catch (err) {
      console.error(err);
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black p-6">
      <form className="bg-white p-12 rounded-none shadow-2xl w-full max-w-md border-t-8 border-black transform transition duration-500 hover:scale-105" onSubmit={handleMobileSubmit}>
        <h2 className="text-4xl font-black text-center text-black mb-8 uppercase tracking-tighter">Create Account</h2>
        {error && <p className="text-red-500 mb-6 text-center font-bold text-xs uppercase tracking-widest">{error}</p>}
        <div className="mb-8">
          <label className="block text-gray-600 mb-2 font-bold uppercase tracking-widest text-xs">Mobile Number</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full px-4 py-3 border-4 border-black rounded-none shadow-sm focus:outline-none focus:ring-0 placeholder-gray-400 font-bold"
            required
            placeholder="PHONE NUMBER"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-4 rounded-none font-black uppercase tracking-widest hover:bg-gray-800 transition duration-300 transform hover:scale-105"
        >
          Get OTP
        </button>
      </form>

      {/* OTP Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-12 rounded-none shadow-2xl w-full max-w-md border-t-8 border-black">
            <h2 className="text-3xl font-black mb-8 text-center text-black uppercase tracking-tighter">Verify OTP</h2>
            {error && <p className="text-red-500 mb-6 text-center font-bold text-xs uppercase tracking-widest">{error}</p>}
            <div className="mb-8">
              <label className="block text-gray-600 mb-2 font-bold uppercase tracking-widest text-xs">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border-4 border-black rounded-none shadow-sm focus:outline-none focus:ring-0 placeholder-gray-400 font-bold"
                required
                placeholder="ENTER OTP"
              />
            </div>
            <div className="flex flex-col gap-4">
              <button
                className="w-full bg-black text-white py-4 rounded-none font-black uppercase tracking-widest hover:bg-gray-800 transition duration-300"
                onClick={handleOtpVerification}
              >
                Verify
              </button>
              <button
                className="w-full bg-white text-black py-3 rounded-none font-bold uppercase tracking-widest hover:bg-gray-100 transition duration-300 border-2 border-black text-sm"
                onClick={() => setIsOtpModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
