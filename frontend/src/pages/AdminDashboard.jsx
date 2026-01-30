import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import {
  LogOut, Users, Home, Landmark, MessageSquare, BarChart3,
  Search, ChevronDown, Eye, Trash2, Edit, Plus
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalLands: 0,
    totalMessages: 0
  });
  const [data, setData] = useState({
    users: [],
    properties: [],
    lands: [],
    messages: []
  });
  const [loading, setLoading] = useState(true);
  const [editingLand, setEditingLand] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    location: '',
    price: '',
    area: '',
    description: '',
  });
  const [editPropertyFormData, setEditPropertyFormData] = useState({
    title: '',
    location: '',
    price: '',
    area: '',
    age: '',
    description: '',
    amenities: '',
  });
  const [requests, setRequests] = useState({ propertyRequests: [], landRequests: [] });

  useEffect(() => {
    fetchAllData();
  }, []);

  const adminAuth = () => ({
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
    },
  });

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const opts = adminAuth();
      const [usersRes, propertiesRes, landsRes, messagesRes, requestRes, landRequestRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/auth/users`, opts).catch(() => ({ data: { users: [] } })),
        axios.get(`${API_BASE_URL}/api/properties`, opts).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/lands`, opts).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/messages`, opts).catch(() => ({ data: { messages: [] } })),
        axios.get(`${API_BASE_URL}/api/request`, opts).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_BASE_URL}/api/land-request`, opts).catch(() => ({ data: { data: [] } }))
      ]);

      const users = Array.isArray(usersRes.data?.users) ? usersRes.data.users : [];
      const properties = Array.isArray(propertiesRes.data) ? propertiesRes.data : [];
      const lands = Array.isArray(landsRes.data) ? landsRes.data : [];
      const messages = Array.isArray(messagesRes.data?.messages) ? messagesRes.data.messages : [];

      setData({
        users,
        properties,
        lands,
        messages
      });

      setRequests({
        propertyRequests: Array.isArray(requestRes.data?.data) ? requestRes.data.data : [],
        landRequests: Array.isArray(landRequestRes.data?.data) ? landRequestRes.data.data : []
      });

      setStats({
        totalUsers: users.length,
        totalProperties: properties.length,
        totalLands: lands.length,
        totalMessages: messages.length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear admin token
    document.cookie = 'adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/admin/login');
  };

  const handleDelete = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        const endpoint = type === 'property' ? 'properties' : type === 'land' ? 'lands' : type;
        await axios.delete(`${API_BASE_URL}/api/${endpoint}/${id}`, adminAuth());
        fetchAllData();
        alert(`${type} deleted successfully!`);
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        alert(`Failed to delete ${type}`);
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
    if (!editingLand || !editFormData.title || !editFormData.location || !editFormData.price || !editFormData.area) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/api/lands/${editingLand}`, editFormData, adminAuth());
      setEditingLand(null);
      setEditFormData({
        title: '',
        location: '',
        price: '',
        area: '',
        description: '',
      });
      fetchAllData();
      alert('Land updated successfully!');
    } catch (error) {
      console.error('Error updating land:', error);
      alert('Failed to update land');
    }
  };

  const handleCancelEdit = () => {
    setEditingLand(null);
    setEditFormData({
      title: '',
      location: '',
      price: '',
      area: '',
      description: '',
    });
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property._id);
    setEditPropertyFormData({
      title: property.title || '',
      location: property.location || '',
      price: property.price || '',
      area: property.area || '',
      age: property.age || '',
      description: property.description || '',
      amenities: property.amenities || '',
    });
  };

  const handleSavePropertyEdit = async () => {
    if (!editingProperty || !editPropertyFormData.title || !editPropertyFormData.location) {
      alert('Please fill in required fields (title, location)');
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/api/properties/${editingProperty}`, editPropertyFormData, adminAuth());
      setEditingProperty(null);
      setEditPropertyFormData({ title: '', location: '', price: '', area: '', age: '', description: '', amenities: '' });
      fetchAllData();
      alert('Property updated successfully!');
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property');
    }
  };

  const handleCancelPropertyEdit = () => {
    setEditingProperty(null);
    setEditPropertyFormData({ title: '', location: '', price: '', area: '', age: '', description: '', amenities: '' });
  };

  // Stat Card Component – always show a number
  const StatCard = ({ title, value, icon: Icon, color }) => {
    const num = Number(value) || 0;
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${color} hover:shadow-xl transition-all duration-300`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">{title}</p>
            <p className="text-4xl font-bold text-black mt-3">{num.toLocaleString()}</p>
          </div>
          <div className={`p-4 rounded-full ${color.replace('border-', 'bg-').replace('l-4', '')}`}>
            <Icon className={`w-8 h-8 ${color.replace('border', 'text')}`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="border-black text-black" />
          <StatCard title="Total Properties" value={stats.totalProperties} icon={Home} color="border-gray-700 text-gray-700" />
          <StatCard title="Total Lands" value={stats.totalLands} icon={Landmark} color="border-gray-600 text-gray-600" />
          <StatCard title="Total Messages" value={stats.totalMessages} icon={MessageSquare} color="border-gray-500 text-gray-500" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b-2 border-gray-300 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'properties', label: 'Properties' },
            { id: 'lands', label: 'Lands' },
            { id: 'messages', label: 'Messages' },
            { id: 'requests', label: 'Requests' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-semibold transition-all whitespace-nowrap text-sm uppercase tracking-wide ${
                activeTab === tab.id
                  ? 'text-black border-b-4 border-black'
                  : 'text-gray-500 hover:text-gray-700 border-b-4 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500 font-semibold">Loading...</p>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Users</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Phone</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.users?.slice(0, 5).map(user => (
                            <tr key={user._id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3">{user.name}</td>
                              <td className="px-4 py-3">{user.email}</td>
                              <td className="px-4 py-3">{user.mobile || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div>
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Phone</th>
                          <th className="px-4 py-2 text-left">Join Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.users?.filter(user =>
                          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map(user => (
                          <tr key={user._id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{user.name}</td>
                            <td className="px-4 py-3">{user.email}</td>
                            <td className="px-4 py-3">{user.mobile || 'N/A'}</td>
                            <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Properties Tab */}
              {activeTab === 'properties' && (
                <div>
                  {/* Add Property Button */}
                  <div className="mb-6">
                    <button 
                      onClick={() => navigate('/add-property')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <Plus className="w-5 h-5" />
                      Add New Property
                    </button>
                  </div>

                  {/* Properties Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.properties && data.properties.length > 0 ? (
                      data.properties.map(property => {
                        const propId = property._id || property.id;
                        return (
                        <div key={propId} className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${editingProperty === propId ? 'border-black' : 'border-gray-200'}`}>
                          <div className="relative">
                            {(property.images?.[0] || property.imageUrl) && (
                              <img src={property.images?.[0] || property.imageUrl} alt={property.title} className="w-full h-48 object-cover" />
                            )}
                            <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Property
                            </div>
                          </div>
                          <div className="p-5">
                            {editingProperty === propId ? (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Title</label>
                                  <input type="text" value={editPropertyFormData.title} onChange={(e) => setEditPropertyFormData({ ...editPropertyFormData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="Title" />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Location</label>
                                  <input type="text" value={editPropertyFormData.location} onChange={(e) => setEditPropertyFormData({ ...editPropertyFormData, location: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="Location" />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Price (₹)</label>
                                  <input type="number" value={editPropertyFormData.price} onChange={(e) => setEditPropertyFormData({ ...editPropertyFormData, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="Price" />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Area</label>
                                  <input type="text" value={editPropertyFormData.area} onChange={(e) => setEditPropertyFormData({ ...editPropertyFormData, area: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="Area" />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Description</label>
                                  <textarea value={editPropertyFormData.description} onChange={(e) => setEditPropertyFormData({ ...editPropertyFormData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm" rows="2" placeholder="Description" />
                                </div>
                                <div className="flex gap-2 pt-2">
                                  <button onClick={handleSavePropertyEdit} className="flex-1 bg-black hover:bg-gray-800 text-white py-2 rounded-lg text-sm font-semibold">Save</button>
                                  <button onClick={handleCancelPropertyEdit} className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg text-sm font-semibold">Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <h3 className="font-bold text-gray-800 text-lg mb-2">{property.title}</h3>
                                <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                                  <Home className="w-4 h-4 text-gray-500" />
                                  {property.location}
                                </div>
                                <p className="text-black font-bold text-xl mb-4">₹ {property.price?.toLocaleString()}</p>
                                <div className="flex gap-2">
                                  <button onClick={() => navigate(`/property-details/${propId}`)} className="flex-1 bg-black hover:bg-gray-800 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-all">
                                    <Eye className="w-4 h-4" /> View
                                  </button>
                                  <button onClick={() => handleEditProperty({ ...property, _id: propId })} className="flex-1 bg-black hover:bg-gray-800 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-all">
                                    <Edit className="w-4 h-4" /> Edit
                                  </button>
                                  <button onClick={() => handleDelete('property', propId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-all">
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <Home className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 text-lg font-semibold">No properties yet</p>
                        <p className="text-gray-500 text-sm mt-1">Click "Add New Property" to get started</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Lands Tab */}
              {activeTab === 'lands' && (
                <div>
                  {/* Add Land Button */}
                  <div className="mb-6">
                    <button 
                      onClick={() => navigate('/add-land')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <Plus className="w-5 h-5" />
                      Add New Land
                    </button>
                  </div>

                  {/* Lands Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.lands && data.lands.length > 0 ? (
                      data.lands.map(land => (
                        <div key={land._id} className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${editingLand === land._id ? 'border-black' : 'border-gray-200'}`}>
                          <div className="relative">
                            {land.images && land.images[0] && (
                              <img src={land.images[0]} alt={land.title} className="w-full h-48 object-cover" />
                            )}
                            <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Land
                            </div>
                          </div>
                          <div className="p-5">
                            {editingLand === land._id ? (
                              /* Edit Form */
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Title</label>
                                  <input
                                    type="text"
                                    value={editFormData.title}
                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                                    placeholder="Land Title"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Location</label>
                                  <input
                                    type="text"
                                    value={editFormData.location}
                                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                                    placeholder="Location"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Price (₹)</label>
                                  <input
                                    type="number"
                                    value={editFormData.price}
                                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                                    placeholder="Price"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Area (Acres)</label>
                                  <input
                                    type="number"
                                    value={editFormData.area}
                                    onChange={(e) => setEditFormData({ ...editFormData, area: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                                    placeholder="Area in acres"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Description</label>
                                  <textarea
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                                    placeholder="Description"
                                    rows="2"
                                  />
                                </div>
                                <div className="flex gap-2 pt-2">
                                  <button
                                    onClick={handleSaveEdit}
                                    className="flex-1 bg-black hover:bg-gray-800 text-white py-2 rounded-lg text-sm font-semibold transition-all"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg text-sm font-semibold transition-all"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Display Mode */
                              <>
                                <h3 className="font-bold text-gray-800 text-lg mb-2">{land.title}</h3>
                                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                  <Landmark className="w-4 h-4 text-gray-500" />
                                  {land.location}
                                </div>
                                <p className="text-gray-700 text-sm font-medium mb-3">📐 {land.area} acres</p>
                                <p className="text-black font-bold text-xl mb-4">₹ {land.price?.toLocaleString()}</p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditLand(land)}
                                    className="flex-1 bg-black hover:bg-gray-800 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-all"
                                  >
                                    <Edit className="w-4 h-4" /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete('land', land._id)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-all"
                                  >
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <Landmark className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 text-lg font-semibold">No lands yet</p>
                        <p className="text-gray-500 text-sm mt-1">Click "Add New Land" to get started</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Message</th>
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.messages?.map(message => (
                          <tr key={message._id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{message.name}</td>
                            <td className="px-4 py-3">{message.email}</td>
                            <td className="px-4 py-3 truncate">{message.message}</td>
                            <td className="px-4 py-3">{new Date(message.createdAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleDelete('message', message._id)}
                                className="text-red-600 hover:text-red-800 font-medium"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Requests Tab - Property & Land requests (user request papers) */}
              {activeTab === 'requests' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Property / Land Requests (Papers)</h2>
                    <p className="text-gray-600 text-sm mb-4">Requests from /api/request</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left">User</th>
                            <th className="px-4 py-2 text-left">Item</th>
                            <th className="px-4 py-2 text-left">Location</th>
                            <th className="px-4 py-2 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests.propertyRequests?.map((r) => (
                            <tr key={r._id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3">{r.userId?.name || 'N/A'} {r.userId?.mobile && `(${r.userId.mobile})`}</td>
                              <td className="px-4 py-3">{r.landId?.title || r.landId?.name || '—'}</td>
                              <td className="px-4 py-3">{r.landId?.location || '—'}</td>
                              <td className="px-4 py-3">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
                            </tr>
                          ))}
                          {(!requests.propertyRequests || requests.propertyRequests.length === 0) && (
                            <tr><td colSpan="4" className="px-4 py-4 text-center text-gray-500">No property/land requests yet</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Land Requests (Logged-in users)</h2>
                    <p className="text-gray-600 text-sm mb-4">Requests from /api/land-request</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left">User</th>
                            <th className="px-4 py-2 text-left">Land</th>
                            <th className="px-4 py-2 text-left">Location</th>
                            <th className="px-4 py-2 text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests.landRequests?.map((r) => (
                            <tr key={r._id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3">{r.userId?.name || 'N/A'} {r.userId?.email && `(${r.userId.email})`}</td>
                              <td className="px-4 py-3">{r.landId?.title || '—'}</td>
                              <td className="px-4 py-3">{r.landId?.location || '—'}</td>
                              <td className="px-4 py-3">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
                            </tr>
                          ))}
                          {(!requests.landRequests || requests.landRequests.length === 0) && (
                            <tr><td colSpan="4" className="px-4 py-4 text-center text-gray-500">No land requests yet</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

