import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, Landmark, CheckCircle, Circle, ArrowLeft, RefreshCcw, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api';

const BannerManagement = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('properties');
    const [properties, setProperties] = useState([]);
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const adminAuth = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
        },
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [propRes, landRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/properties`, adminAuth()),
                axios.get(`${API_BASE_URL}/api/lands`, adminAuth())
            ]);
            setProperties(Array.isArray(propRes.data) ? propRes.data : []);
            setLands(Array.isArray(landRes.data) ? landRes.data : []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleBanner = async (type, id, currentStatus) => {
        try {
            await axios.patch(`${API_BASE_URL}/api/admin/banner/${type}/${id}`, 
                { showInBanner: !currentStatus }, 
                adminAuth()
            );
            
            // Optimistic update
            if (type === 'property') {
                setProperties(prev => prev.map(p => p._id === id ? { ...p, showInBanner: !currentStatus } : p));
            } else {
                setLands(prev => prev.map(l => l._id === id ? { ...l, showInBanner: !currentStatus } : l));
            }
        } catch (error) {
            console.error('Error toggling banner status:', error);
            alert('Failed to update banner status.');
        }
    };

    const filteredItems = (activeTab === 'properties' ? properties : lands).filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-8 border-black pb-8">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate('/admin/marketing')}
                        className="p-3 bg-black text-white hover:bg-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter text-black">Banner Selection</h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Select assets to spotlight on the homepage</p>
                    </div>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:w-80">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="FILTER ASSETS..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border-4 border-black rounded-none placeholder-gray-400 font-bold uppercase tracking-widest text-sm focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b-4 border-gray-100">
                <button 
                    onClick={() => setActiveTab('properties')}
                    className={`px-12 py-6 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'properties' ? 'border-b-8 border-black text-black bg-gray-50' : 'text-gray-400 hover:text-black'}`}
                >
                    <div className="flex items-center gap-3">
                        <Home className="w-5 h-5" /> Properties ({properties.filter(p => p.showInBanner).length} Featured)
                    </div>
                </button>
                <button 
                    onClick={() => setActiveTab('lands')}
                    className={`px-12 py-6 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'lands' ? 'border-b-8 border-black text-black bg-gray-50' : 'text-gray-400 hover:text-black'}`}
                >
                    <div className="flex items-center gap-3">
                        <Landmark className="w-5 h-5" /> Lands ({lands.filter(l => l.showInBanner).length} Featured)
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {loading ? (
                    <div className="col-span-full py-24 text-center">
                        <RefreshCcw className="w-16 h-16 mx-auto animate-spin text-black mb-6" />
                        <p className="text-3xl font-black uppercase tracking-tighter text-gray-400 animate-pulse">Synchronizing Data Matrix...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="col-span-full py-24 text-center">
                        <p className="text-2xl font-black uppercase tracking-tighter text-gray-300">No matching assets found.</p>
                    </div>
                ) : (
                    filteredItems.map(item => (
                        <div key={item._id} className={`bg-white border-t-8 ${item.showInBanner ? 'border-green-500 ring-8 ring-green-500/10' : 'border-black opacity-80'} rounded-none shadow-2xl overflow-hidden transition-all duration-300 group`}>
                            <div className="h-56 relative bg-gray-200">
                                <img 
                                    src={item.imageUrls?.[0] || item.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                {item.showInBanner && (
                                    <div className="absolute top-0 right-0 bg-green-500 text-white px-6 py-2 font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4"/> Live on Banner
                                    </div>
                                )}
                            </div>
                            <div className="p-8">
                                <h4 className="text-2xl font-black uppercase tracking-tighter text-black truncate mb-2">{item.title}</h4>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">{item.location}</p>
                                
                                <button
                                    onClick={() => toggleBanner(activeTab === 'properties' ? 'property' : 'land', item._id, item.showInBanner)}
                                    className={`w-full py-4 px-6 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all transform active:scale-95 ${item.showInBanner ? 'bg-red-500 text-white hover:bg-black' : 'bg-black text-white hover:bg-green-600'}`}
                                >
                                    {item.showInBanner ? (
                                        <><Circle className="w-5 h-5" /> Remove from Banner</>
                                    ) : (
                                        <><CheckCircle className="w-5 h-5" /> Add to Banner</>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BannerManagement;
