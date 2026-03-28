import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Home, Trash2, Edit, Plus, Search, MapPin, Eye, Tag } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const AdminProperties = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const adminAuth = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
        },
    });

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/properties`, adminAuth());
            setProperties(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);
    const handleDelete = async (id) => {
        if (window.confirm('Delete this property permanently?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/properties/${id}`, adminAuth());
                fetchProperties();
                alert('Property deleted.');
            } catch (error) {
                console.error('Error deleting property:', error);
            }
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-8 border-black pb-8">
                <h2 className="text-5xl font-black uppercase tracking-tighter text-black">Property Inventory</h2>
                <button 
                    onClick={() => navigate('/add-property')}
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
                ) : properties.length === 0 ? (
                    <div className="col-span-full py-24 text-center">
                        <Home className="w-24 h-24 mx-auto text-gray-200 mb-6" />
                        <p className="text-3xl font-black uppercase tracking-tighter text-gray-300">No Assets Under Management</p>
                    </div>
                ) : (
                    properties.map(property => {
                      const propId = property._id || property.id;
                      return (
                        <div key={propId} className="bg-white rounded-none shadow-2xl overflow-hidden border-t-8 border-black transition-all transform hover:scale-[1.02]">
                            <div className="h-64 relative bg-gray-200">
                                <img 
                                    src={(property.imageUrls && property.imageUrls[0]) || property.images?.[0] || property.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'} 
                                    alt={property.title} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-0 right-0 bg-black text-white px-6 py-2 font-black uppercase tracking-widest text-xs">
                                    Property
                                </div>
                            </div>
                            
                            <div className="p-8">
                                <h3 className="text-3xl font-black uppercase tracking-tighter text-black mb-2 truncate">{property.title}</h3>
                                <p className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-xs mb-4"><MapPin className="w-4 h-4" /> {property.location}</p>
                                
                                <div className="flex justify-between items-end mb-8 border-b-2 border-gray-100 pb-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Price</p>
                                        <p className="text-4xl font-black text-black tracking-tighter">₹ {property.price?.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Area</p>
                                        <p className="text-lg font-black text-black tracking-tighter">{property.area} SQFT</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => navigate(`/property-details/${propId}`)} className="bg-black text-white p-4 font-black transition-colors hover:bg-gray-800"><Eye className="w-5 h-5"/></button>
                                    <button onClick={() => navigate(`/admin/edit-property/${propId}`)} className="flex-grow bg-black text-white px-6 py-4 font-black uppercase tracking-widest text-xs tracking-tighter hover:bg-gray-800 transition-colors">EDIT ASSET</button>
                                    <button onClick={() => handleDelete(propId)} className="bg-black text-white p-4 font-black transition-colors hover:bg-red-600"><Trash2 className="w-5 h-5"/></button>
                                </div>
                            </div>
                        </div>
                      )
                    })
                )}
            </div>
        </div>
    );
};

export default AdminProperties;
