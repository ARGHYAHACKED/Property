import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Trash2, Mail, Calendar, User, Phone } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const adminAuth = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
        },
    });

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/messages`, adminAuth());
            setMessages(Array.isArray(res.data?.messages) ? res.data.messages : []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this message?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/messages/${id}`, adminAuth());
                fetchMessages();
                alert('Message deleted.');
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    };

    return (
        <div className="space-y-12">
            <div className="border-b-8 border-black pb-8">
                <h2 className="text-5xl font-black uppercase tracking-tighter text-black">Inbound Inquiries</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-full py-24 text-center font-black animate-pulse text-gray-400 text-3xl uppercase tracking-tighter">SCREENING MESSAGES...</div>
                ) : messages.length === 0 ? (
                    <div className="col-span-full py-24 text-center">
                        <MessageSquare className="w-24 h-24 mx-auto text-gray-200 mb-6" />
                        <p className="text-3xl font-black uppercase tracking-tighter text-gray-300">Clean Inbox</p>
                    </div>
                ) : (
                    messages.map(msg => (
                        <div key={msg._id} className="bg-white p-10 rounded-none shadow-2xl border-t-8 border-black hover:scale-[1.01] transition-transform relative group">
                            <div className="flex justify-between items-start mb-8 border-b-4 border-black pb-4">
                                <div className="space-y-4 w-full">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-black text-white p-2"><User className="w-5 h-5"/></div>
                                        <h3 className="text-2xl font-black uppercase tracking-tighter text-black">{msg.name}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-black text-white p-1.5"><Phone className="w-3.5 h-3.5"/></div>
                                            <p className="font-bold text-gray-600 uppercase tracking-widest text-[10px]">{msg.phone}</p>
                                        </div>
                                        {msg.altPhone && (
                                            <div className="flex items-center gap-2 opacity-60">
                                                <div className="bg-gray-400 text-white p-1.5"><Phone className="w-3.5 h-3.5"/></div>
                                                <p className="font-bold text-gray-600 uppercase tracking-widest text-[10px]">{msg.altPhone}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right whitespace-nowrap hidden sm:block">
                                    <div className="flex items-center gap-2 text-gray-400 font-black uppercase tracking-widest text-[10px]">
                                        <Calendar className="w-4 h-4"/> {new Date(msg.timestamp || msg.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                <div className="bg-black text-white p-4 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Mouja</p>
                                    <p className="font-black uppercase tracking-tighter text-lg">{msg.mouja}</p>
                                </div>
                                <div className="border-4 border-black p-4 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Plot No.</p>
                                    <p className="font-black uppercase tracking-tighter text-lg">{msg.plot}</p>
                                </div>
                                <div className="bg-gray-100 p-4 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Khatian</p>
                                    <p className="font-black uppercase tracking-tighter text-lg">{msg.khatian}</p>
                                </div>
                            </div>

                            {msg.comment && (
                                <div className="bg-gray-50 p-6 border-l-8 border-black mb-8 min-h-[100px] relative">
                                    <div className="absolute top-0 right-0 p-2 opacity-5"><MessageSquare className="w-12 h-12"/></div>
                                    <p className="text-black font-bold uppercase tracking-tight leading-relaxed italic opacity-80 break-words relative z-10">
                                        "{msg.comment}"
                                    </p>
                                </div>
                            )}

                            <button 
                                onClick={() => handleDelete(msg._id)}
                                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-black py-4 uppercase tracking-widest text-xs hover:bg-black transition-all"
                            >
                                <Trash2 className="w-5 h-5"/> Purge Message
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminMessages;
