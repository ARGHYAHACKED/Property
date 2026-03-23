import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie
import API_BASE_URL from '../config/api';

const OtpVerify = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get userId from the cookie
  const userId = Cookies.get("userId");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("User ID not found. Please complete the OTP verification process.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Make API call to update user details
      const response = await axios.post(`${API_BASE_URL}/api/auth/completeRegistration`, {
        userId,
        name: formData.name,
        email: formData.email,
      });

      if (response.data.token) {
        const token = response.data.token;
        Cookies.set("token", token, { expires: 7 });
        localStorage.setItem("token", token);

        navigate("/profile", { replace: true });
      } else {
        setError("Failed to update user details. Please try again.");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black p-6">
      <form className="bg-white p-12 rounded-none shadow-2xl w-full max-w-md border-t-8 border-black transform transition duration-500 hover:scale-105" onSubmit={handleSubmit}>
        <h2 className="text-4xl font-black text-center text-black mb-8 uppercase tracking-tighter">Complete Profile</h2>
        {error && <p className="text-red-500 mb-6 text-center font-bold text-xs uppercase tracking-widest">{error}</p>}
        <div className="mb-8">
          <label className="block text-gray-600 mb-2 font-bold uppercase tracking-widest text-xs">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border-4 border-black rounded-none shadow-sm focus:outline-none focus:ring-0 placeholder-gray-400 font-bold"
            required
            placeholder="FULL NAME"
          />
        </div>
        <div className="mb-8">
          <label className="block text-gray-600 mb-2 font-bold uppercase tracking-widest text-xs">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border-4 border-black rounded-none shadow-sm focus:outline-none focus:ring-0 placeholder-gray-400 font-bold"
            required
            placeholder="EMAIL ADDRESS"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-4 rounded-none font-black uppercase tracking-widest transition duration-300 transform hover:scale-105 ${
            loading ? "bg-gray-400 text-gray-600 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default OtpVerify;
