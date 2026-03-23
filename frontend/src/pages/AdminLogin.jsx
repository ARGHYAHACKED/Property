import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { Lock, Mail, Eye, EyeOff, LogIn } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send POST request to the login API endpoint
      const response = await axios.post(`${API_BASE_URL}/api/admin/login`, 
        { email, password },
        { withCredentials: true }  // To include cookies in the request
      );

      // If login is successful (status code 200), redirect to dashboard
      if (response.status === 200) {
        // Store token in localStorage as fallback
        if (response.data.token) {
          localStorage.setItem('adminToken', response.data.token);
        }
        console.log('Login successful, redirecting to dashboard');
        navigate('/admin/dashboard');  // Navigate to the dashboard
      }
    } catch (err) {
      // Handle errors (invalid email/password)
      setError(err.response?.data?.message || 'Invalid email or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-none shadow-2xl overflow-hidden border-t-8 border-black transform transition duration-500 hover:scale-105">
          <div className="bg-black px-8 py-12">
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-none">
                <Lock className="w-10 h-10 text-black" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-center text-white uppercase tracking-tighter">Admin Access</h1>
            <p className="text-gray-400 text-center text-xs mt-4 uppercase tracking-widest font-bold font-mono">ENCRYPTED GATEWAY</p>
          </div>

          <div className="px-10 py-12">
            {error && (
              <div className="mb-8 p-4 bg-gray-100 border-l-8 border-black">
                <p className="text-black text-xs font-black uppercase tracking-widest">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Identifier</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-black" />
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-4 border-4 border-black rounded-none focus:outline-none focus:ring-4 focus:ring-black/5 bg-gray-50 font-bold placeholder-gray-300"
                    placeholder="ADMINISTRATOR EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Secret Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 w-5 h-5 text-black" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-12 pr-12 py-4 border-4 border-black rounded-none focus:outline-none focus:ring-4 focus:ring-black/5 bg-gray-50 font-bold placeholder-gray-300"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-black hover:scale-110 transition-transform"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white font-black py-5 px-4 rounded-none transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-400 transform active:scale-95"
              >
                <LogIn className="w-6 h-6" />
                {loading ? 'AUTHENTICATING...' : 'ESTABLISH SESSION'}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t-2 border-gray-100">
              <p className="text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                LEVEL 7 AUTHORIZATION REQUIRED.<br/>ALL ACTIONS ARE LOGGED AND MONITORED.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
