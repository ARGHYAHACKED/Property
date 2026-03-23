import React, { useState , useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../config/api';

const LoginPage = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();





    useEffect(() => {
      const token = Cookies.get("token") || localStorage.getItem("token");
      if (token) {
        navigate("/profile", { replace: true });
      }
    }, [navigate]);

    const handleSendOtp = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { phone });
            if (response.data.message) {
                setMessage(response.data.message);
                setIsOtpSent(true);
            }
        } catch (error) {
            console.error('Error sending OTP:', error.response?.data || error.message);
            setMessage('Failed to send OTP. Please try again.');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/loginVerifyOtp`, { phone, otp });
            if (response.data.token) {
                setMessage('OTP verified successfully!');
                const token = response.data.token;
                Cookies.set('token', token, { expires: 7 });
                localStorage.setItem('token', token);
                navigate('/profile', { replace: true });
            }
        } catch (error) {
            console.error('Error verifying OTP:', error.response?.data || error.message);
            setMessage('Failed to verify OTP. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-6">
            <div className="bg-white rounded-none shadow-2xl p-12 w-full max-w-md transform transition duration-500 hover:scale-105 border-t-8 border-black">
                <h2 className="text-4xl font-black text-center text-black mb-8 uppercase tracking-tighter">Welcome Back</h2>
                <p className="text-center text-gray-600 mb-8 font-bold uppercase tracking-widest text-xs">
                    {isOtpSent
                        ? "Enter the OTP sent to your phone"
                        : "Enter your phone number to get started"}
                </p>

                {!isOtpSent ? (
                    <div className="space-y-6">
                        <input
                            type="text"
                            className="w-full px-4 py-3 border-4 border-black rounded-none shadow-sm focus:outline-none focus:ring-0 placeholder-gray-400 font-bold"
                            placeholder="PHONE NUMBER"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <button
                            onClick={handleSendOtp}
                            className="w-full bg-black text-white py-4 rounded-none font-black uppercase tracking-widest hover:bg-gray-800 transition duration-300 transform hover:scale-105"
                        >
                            Send OTP
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <input
                            type="text"
                            className="w-full px-4 py-3 border-4 border-black rounded-none shadow-sm focus:outline-none focus:ring-0 placeholder-gray-400 font-bold"
                            placeholder="ENTER OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                            onClick={handleVerifyOtp}
                            className="w-full bg-black text-white py-4 rounded-none font-black uppercase tracking-widest hover:bg-gray-800 transition duration-300 transform hover:scale-105"
                        >
                            Verify OTP
                        </button>
                    </div>
                )}

                {/* Display messages */}
                {message && (
                    <p className="text-center mt-8 text-xs font-black uppercase tracking-widest text-black bg-gray-100 rounded-none p-4 border-2 border-black">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
