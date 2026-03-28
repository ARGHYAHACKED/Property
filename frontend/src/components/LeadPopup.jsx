import React, { useState, useEffect } from 'react';
import { X, Phone, User, CheckCircle } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const LeadPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if user is already logged in (regular user or admin)
        const isUserLoggedIn = localStorage.getItem('token');
        const isAdminLoggedIn = localStorage.getItem('adminToken');
        const hasSubmitted = localStorage.getItem('leadCaptured');

        // If logged in or already submitted, don't show the popup
        if (isUserLoggedIn || isAdminLoggedIn || hasSubmitted) return;

        // Check if closed in this session
        const isClosedThisSession = sessionStorage.getItem('leadPopupClosed');
        if (isClosedThisSession) return;

        // Trigger after 20 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 20000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Set session storage so it doesn't show again until reload
        sessionStorage.setItem('leadPopupClosed', 'true');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!formData.name || !formData.phone) {
            setError('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/leads`, formData);
            setIsSubmitted(true);
            // Set local storage so it NEVER shows again for this user
            localStorage.setItem('leadCaptured', 'true');
            
            // Hide after a short delay to show success state
            setTimeout(() => {
                setIsVisible(false);
            }, 3000);
        } catch (err) {
            console.error('Error submitting lead:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-md relative overflow-hidden border-t-8 border-black shadow-2xl">
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {!isSubmitted ? (
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-black text-white rounded-none">
                                <Phone className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Get Best Deals</h2>
                        </div>
                        
                        <p className="text-gray-600 mb-8 font-medium">
                            Leave your contact details and our property experts will get back to you with exclusive land and property deals in your area.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Your Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Full Name"
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 focus:border-black outline-none transition-all font-bold"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="tel" 
                                        placeholder="+91 XXXXX XXXXX"
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 focus:border-black outline-none transition-all font-bold"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-xs font-bold uppercase">{error}</p>}

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? 'Submitting...' : 'Request Call Back'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="p-12 text-center animate-fadeIn">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Thank You!</h2>
                        <p className="text-gray-600 font-medium">
                            Your details have been captured. Our team will contact you shortly with the best property options.
                        </p>
                    </div>
                )}
                
                {/* Visual Flair */}
                <div className="h-2 bg-gradient-to-r from-black via-gray-700 to-black"></div>
            </div>
        </div>
    );
};

export default LeadPopup;
