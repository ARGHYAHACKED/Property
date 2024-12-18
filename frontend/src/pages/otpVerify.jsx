import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OtpVerify = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Details:", formData);
    navigate("/profile");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Complete Profile</h2>
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
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default OtpVerify;
