import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import { Trash2, Search, Calendar, Phone, User, ExternalLink } from 'lucide-react';

const AdminLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLeads = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get(`${API_BASE_URL}/api/leads`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeads(res.data);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API_BASE_URL}/api/leads/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeads(leads.filter(lead => lead._id !== id));
        } catch (error) {
            console.error('Error deleting lead:', error);
        }
    };

    const filteredLeads = leads.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lead.phone.includes(searchTerm)
    );

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-black">Lead Generation</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">
                        High-intent visitors captured via website popup
                    </p>
                </div>
                
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by name or phone..."
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 focus:border-black outline-none transition-all font-bold text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
                </div>
            ) : filteredLeads.length > 0 ? (
                <div className="bg-white border-2 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black text-white">
                                    <th className="p-4 border-r border-gray-800 uppercase tracking-widest text-[10px] font-black">Date</th>
                                    <th className="p-4 border-r border-gray-800 uppercase tracking-widest text-[10px] font-black">Name</th>
                                    <th className="p-4 border-r border-gray-800 uppercase tracking-widest text-[10px] font-black">Contact</th>
                                    <th className="p-4 border-r border-gray-800 uppercase tracking-widest text-[10px] font-black text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-gray-100">
                                {filteredLeads.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 border-r border-gray-100">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-sm font-bold">{formatDate(lead.createdAt)}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 border-r border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-black font-black text-xs uppercase">
                                                    {lead.name.charAt(0)}
                                                </div>
                                                <span className="font-black text-black uppercase tracking-tight">{lead.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 border-r border-gray-100">
                                             <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-black text-black">{lead.phone}</span>
                                                </div>
                                                <a 
                                                    href={`tel:${lead.phone}`}
                                                    className="p-2 text-black hover:bg-black hover:text-white transition-all"
                                                    title="Call Lead"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                             </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center">
                                                <button 
                                                    onClick={() => handleDelete(lead._id)}
                                                    className="p-3 text-red-500 hover:bg-red-500 hover:text-white transition-all transform active:scale-95"
                                                    title="Delete Lead"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white border-2 border-black p-20 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <User className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-black uppercase tracking-tighter text-black">No Leads Captured</h3>
                    <p className="text-gray-500 font-medium">Capture high-quality leads using the website popup.</p>
                </div>
            )}
        </div>
    );
};

export default AdminLeads;
