import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to the login API endpoint
      const response = await axios.post('http://localhost:5000/api/admin/login', 
        { email, password },
        { withCredentials: true }  // To include cookies in the request
      );
      console.log("herer")

      // If login is successful (status code 200), redirect to dashboard
      if (response.status === 200) {
        console.log('dash')
        navigate('/admin/dashboard');  // Navigate to the dashboard
      }
    } catch (err) {
      // Handle errors (invalid email/password)
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Admin Login</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
