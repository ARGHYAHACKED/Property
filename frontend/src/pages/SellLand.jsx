import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../config/api';

const SellLand = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    altPhone: "",
    mouja: "",
    plot: "",
    khatian: "",
    comment: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token"))
        ?.split("=")[1]; 
        // Retrieve token from cookies
      console.log(token);
      if (!token) {
        navigate('/login');
    }
    else{

      
      await axios.post(
        `${API_BASE_URL}/api/messages/create`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // alert("Form submitted successfully!");
      navigate("/land");
    }
      setForm({
        name: "",
        phone: "",
        altPhone: "",
        mouja: "",
        plot: "",
        khatian: "",
        comment: "",
      });
      
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sell Your Land</h1>
      <form
        className="w-full max-w-md bg-white shadow rounded-lg p-4"
        onSubmit={handleSubmit}
      >
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Phone"
          fullWidth
          margin="normal"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          error={!/^\d{10}$/.test(form.phone)} // Phone number validation
          helperText={
            !/^\d{10}$/.test(form.phone) ? "Enter a valid 10-digit phone number" : ""
          }
        />
        <TextField
          label="Alternate Phone"
          fullWidth
          margin="normal"
          name="altPhone"
          value={form.altPhone}
          onChange={handleChange}
        />
        <TextField
          label="Mouja"
          fullWidth
          margin="normal"
          name="mouja"
          value={form.mouja}
          onChange={handleChange}
          required
        />
        <TextField
          label="Plot"
          fullWidth
          margin="normal"
          name="plot"
          value={form.plot}
          onChange={handleChange}
          required
        />
        <TextField
          label="Khatian"
          fullWidth
          margin="normal"
          name="khatian"
          value={form.khatian}
          onChange={handleChange}
          required
        />
        <TextField
          label="Comment"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          name="comment"
          value={form.comment}
          onChange={handleChange}
        />
        <div className="flex justify-end items-center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SellLand;
