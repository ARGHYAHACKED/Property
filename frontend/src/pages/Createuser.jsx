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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Complete Profile</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full text-white py-2 rounded ${
            loading ? "bg-gray-400" : "bg-pink-500 hover:bg-pink-600"
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
