import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie

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
      const response = await axios.post("http://localhost:5001/api/auth/register", {
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
      const response = await axios.post("http://localhost:5001/api/auth/verify-otp", {
        phone: mobile,
        otp,
      });

      // Extract user ID from the response
      const { id: userId } = response.data.user;
      console.log("OTP verified successfully! User ID:", userId);

      // Store userId in a cookie
      Cookies.set("userId", userId, { expires: 7 }); // Cookie expires in 7 days

      // Navigate to CreateUser page
      navigate("/Createuser");
    } catch (err) {
      console.error(err);
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-96" onSubmit={handleMobileSubmit}>
        <h2 className="text-2xl font-bold mb-4">Create Account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Mobile Number</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        >
          Get OTP
        </button>
      </form>

      {/* OTP Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-6 text-center">Verify OTP</h2>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
                onClick={() => setIsOtpModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition duration-200"
                onClick={handleOtpVerification}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
