import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Landmark, Trash2, Edit, Plus, Search, MapPin, Eye, Tag } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const AdminLands = () => {
    const navigate = useNavigate();
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingLand, setEditingLand] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        location: '',
        price: '',
        area: '',
        description: '',
    });

    const adminAuth = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
        },
    });

    const fetchLands = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/lands`, adminAuth());
            setLands(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Error fetching lands:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLands();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this land permanently?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/lands/${id}`, adminAuth());
                fetchLands();
                alert('Land deleted.');
            } catch (error) {
                console.error('Error deleting land:', error);
            }
        }
    };

    const handleEditLand = (land) => {
        setEditingLand(land._id);
        setEditFormData({
            title: land.title || '',
            location: land.location || '',
            price: land.price || '',
            area: land.area || '',
            description: land.description || '',
        });
    };

    const handleSaveEdit = async () => {
        try {
            await axios.put(`${API_BASE_URL}/api/lands/${editingLand}`, editFormData, adminAuth());
            setEditingLand(null);
            fetchLands();
            alert('Land updated.');
        } catch (error) {
            console.error('Error updating land:', error);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-8 border-black pb-8">
                <h2 className="text-5xl font-black uppercase tracking-tighter text-black">Land Inventory</h2>
                <button 
                    onClick={() => navigate('/add-land')}
                    className="flex-grow md:w-auto bg-black text-white px-10 py-5 font-black uppercase tracking-widest rounded-none transform transition duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 border-4 border-black"
                >
                    <Plus className="w-8 h-8" /> Add New Asset
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {loading ? (
                    <div className="col-span-full py-24 flex items-center justify-center">
                        <div className="text-center font-black animate-pulse text-gray-400 text-3xl uppercase tracking-tighter">SYNCHRONIZING ASSETS...</div>
                    </div>
                ) : lands.length === 0 ? (
                    <div className="col-span-full py-24 text-center">
                        <Landmark className="w-24 h-24 mx-auto text-gray-200 mb-6" />
                        <p className="text-3xl font-black uppercase tracking-tighter text-gray-300">No Assets Under Management</p>
                    </div>
                ) : (
                    lands.map(land => (
                        <div key={land._id} className={`bg-white rounded-none shadow-2xl overflow-hidden border-t-8 ${editingLand === land._id ? 'border-red-600 ring-8 ring-black' : 'border-black'} transition-all transform hover:scale-[1.02]`}>
                            <div className="h-64 relative bg-gray-200">
                                <img 
                                    src={land.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'} 
                                    alt={land.title} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-0 right-0 bg-black text-white px-6 py-2 font-black uppercase tracking-widest text-xs">
                                    Land
                                </div>
                            </div>
                            
                            <div className="p-8">
                                {editingLand === land._id ? (
                                    <div className="space-y-6">
                                        <input type="text" value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} className="w-full px-4 py-3 border-4 border-black font-bold uppercase tracking-widest text-sm focus:outline-none" placeholder="TITLE" />
                                        <input type="text" value={editFormData.location} onChange={(e) => setEditFormData({...editFormData, location: e.target.value})} className="w-full px-4 py-3 border-4 border-black font-bold uppercase tracking-widest text-sm focus:outline-none" placeholder="LOCATION" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="number" value={editFormData.price} onChange={(e) => setEditFormData({...editFormData, price: e.target.value})} className="w-full px-4 py-3 border-4 border-black font-bold uppercase tracking-widest text-sm focus:outline-none" placeholder="PRICE (₹)" />
                                            <input type="number" value={editFormData.area} onChange={(e) => setEditFormData({...editFormData, area: e.target.value})} className="w-full px-4 py-3 border-4 border-black font-bold uppercase tracking-widest text-sm focus:outline-none" placeholder="AREA (Acres)" />
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={handleSaveEdit} className="bg-black text-white px-8 py-3 font-black uppercase tracking-widest text-xs w-full">SAVE</button>
                                            <button onClick={() => setEditingLand(null)} className="bg-white text-black border-4 border-black px-8 py-3 font-black uppercase tracking-widest text-xs w-full">CANCEL</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-3xl font-black uppercase tracking-tighter text-black mb-2 truncate">{land.title}</h3>
                                        <p className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-xs mb-4"><MapPin className="w-4 h-4" /> {land.location}</p>
                                        
                                        <div className="flex justify-between items-end mb-8 border-b-2 border-gray-100 pb-4">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Price</p>
                                                <p className="text-4xl font-black text-black tracking-tighter">₹ {land.price?.toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Area</p>
                                                <p className="text-lg font-black text-black tracking-tighter">{land.area} ACRES</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button onClick={() => navigate(`/land/${land._id}`)} className="bg-black text-white p-4 font-black transition-colors hover:bg-gray-800"><Eye className="w-5 h-5"/></button>
                                            <button onClick={() => handleEditLand(land)} className="flex-grow bg-black text-white px-6 py-4 font-black uppercase tracking-widest text-xs tracking-tighter hover:bg-gray-800 transition-colors">EDIT ASSET</button>
                                            <button onClick={() => handleDelete(land._id)} className="bg-black text-white p-4 font-black transition-colors hover:bg-red-600"><Trash2 className="w-5 h-5"/></button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminLands;
