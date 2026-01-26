import React, { useState , useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();





    useEffect(() => {
      const token = Cookies.get("token");
      console.log(token) // Or localStorage.getItem('token') if you store it in localStorage
  
      if (token) {
        // If token exists, redirect to homepage
        // navigate("/profile"); // Redirect to homepage
      }
    }, [navigate]);

    const handleSendOtp = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', { phone });
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
            const response = await axios.post('http://localhost:5001/api/auth/loginVerifyOtp', { phone, otp });
            console.log(response)
            console.log(response.data.token)
            if (response.data.token) {
                
                setMessage('OTP verified successfully!');
                
                Cookies.set('token', response.data.token, { expires: 7 });
                
               
                
                navigate("/");
                window.location.reload()

            }
        } catch (error) {
            console.error('Error verifying OTP:', error.response?.data || error.message);
            setMessage('Failed to verify OTP. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-6">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md transform transition duration-500 hover:scale-105">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-4">
                    {isOtpSent
                        ? "Enter the OTP sent to your phone"
                        : "Enter your phone number to get started"}
                </p>

                {!isOtpSent ? (
                    <div className="space-y-4">
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <button
                            onClick={handleSendOtp}
                            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 rounded-md hover:from-green-500 hover:to-blue-500 transition duration-300"
                        >
                            Send OTP
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                            onClick={handleVerifyOtp}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-md hover:from-pink-500 hover:to-purple-500 transition duration-300"
                        >
                            Verify OTP
                        </button>
                    </div>
                )}

                {/* Display messages */}
                {message && (
                    <p className="text-center mt-4 text-sm text-gray-700 bg-gray-100 rounded p-2">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
