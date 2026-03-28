import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileCheck, Landmark, Home, User, Mail, Phone, Calendar } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const AdminRequests = () => {
    const [propertyRequests, setPropertyRequests] = useState([]);
    const [landRequests, setLandRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const adminAuth = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
        },
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [propReqs, landReqs] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/request`, adminAuth()).catch(() => ({ data: { data: [] } })),
                axios.get(`${API_BASE_URL}/api/land-request`, adminAuth()).catch(() => ({ data: { data: [] } }))
            ]);

            setPropertyRequests(Array.isArray(propReqs.data?.data) ? propReqs.data.data : []);
            setLandRequests(Array.isArray(landReqs.data?.data) ? landReqs.data.data : []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-12">
            <div className="border-b-8 border-black pb-8">
                <h2 className="text-5xl font-black uppercase tracking-tighter text-black">User Requests Pipeline</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Section 1: Property and Land Inquiry Papers */}
                <div className="bg-white p-12 rounded-none shadow-2xl border-t-8 border-black min-h-[500px]">
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-black mb-8 border-b-4 border-black pb-4 inline-block">
                        Interest Papers Inbound
                    </h3>
                    <div className="space-y-8">
                        {propertyRequests.length === 0 ? (
                            <div className="text-center py-12 text-gray-300 font-black uppercase tracking-tighter text-2xl animate-pulse">NO PENDING INTEREST PAPERS</div>
                        ) : propertyRequests.map(r => (
                            <div key={r._id} className="bg-gray-50 border-4 border-black p-8 rounded-none transition-transform hover:scale-105">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-black text-white p-1"><User className="w-5 h-5"/></div>
                                            <p className="font-black text-black uppercase tracking-widest text-lg leading-none">{r.userId?.name || 'PRIVATE'}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-black text-white p-1"><Phone className="w-4 h-4"/></div>
                                            <p className="font-bold text-gray-500 uppercase tracking-widest text-xs leading-none">{r.userId?.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                            <Calendar className="w-4 h-4"/> {new Date(r.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-black text-white p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Home className="w-5 h-5"/>
                                        <p className="font-black uppercase tracking-widest text-sm truncate">{r.landId?.title || r.landId?.name || 'ASSET MISSING'}</p>
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">LOCATION: {r.landId?.location || ' — '}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 2: Logged-in Land Requests */}
                <div className="bg-white p-12 rounded-none shadow-2xl border-t-8 border-black min-h-[500px]">
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-black mb-8 border-b-4 border-black pb-4 inline-block">
                        Land Inquiries Inbound
                    </h3>
                    <div className="space-y-8">
                        {landRequests.length === 0 ? (
                            <div className="text-center py-12 text-gray-300 font-black uppercase tracking-tighter text-2xl animate-pulse">NO PENDING LAND INQUIRIES</div>
                        ) : landRequests.map(r => (
                            <div key={r._id} className="bg-gray-50 border-4 border-black p-8 rounded-none transition-transform hover:scale-105">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-black text-white p-1"><User className="w-5 h-5"/></div>
                                            <p className="font-black text-black uppercase tracking-widest text-lg leading-none">{r.userId?.name || 'PRIVATE'}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-black text-white p-1"><Mail className="w-4 h-4"/></div>
                                            <p className="font-bold text-gray-500 uppercase tracking-widest text-xs leading-none">{r.userId?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                            <Calendar className="w-4 h-4"/> {new Date(r.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-black text-white p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Landmark className="w-5 h-5"/>
                                        <p className="font-black uppercase tracking-widest text-sm truncate">{r.landId?.title || 'ASSET MISSING'}</p>
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">LOCATION: {r.landId?.location || ' — '}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRequests;
