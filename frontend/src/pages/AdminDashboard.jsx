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

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [usersRes, propertiesRes, landsRes, messagesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/auth/users`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/api/properties`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/api/lands`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/api/messages`, { withCredentials: true })
      ]);

      setData({
        users: usersRes.data?.users || [],
        properties: propertiesRes.data || [],
        lands: landsRes.data || [],
        messages: messagesRes.data?.messages || []
      });

      setStats({
        totalUsers: usersRes.data?.users?.length || 0,
        totalProperties: propertiesRes.data?.length || 0,
        totalLands: landsRes.data?.length || 0,
        totalMessages: messagesRes.data?.messages?.length || 0
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
        await axios.delete(`${API_BASE_URL}/api/${endpoint}/${id}`, { withCredentials: true });
        fetchAllData();
        alert(`${type} deleted successfully!`);
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        alert(`Failed to delete ${type}`);
      }
    }
  };

  // Stat Card Component
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <Icon className={`w-12 h-12 ${color.replace('border', 'text')}`} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="border-blue-500 text-blue-500" />
          <StatCard title="Total Properties" value={stats.totalProperties} icon={Home} color="border-green-500 text-green-500" />
          <StatCard title="Total Lands" value={stats.totalLands} icon={Landmark} color="border-yellow-500 text-yellow-500" />
          <StatCard title="Total Messages" value={stats.totalMessages} icon={MessageSquare} color="border-purple-500 text-purple-500" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'properties', label: 'Properties' },
            { id: 'lands', label: 'Lands' },
            { id: 'messages', label: 'Messages' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">Loading...</p>
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
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <Plus className="w-5 h-5" />
                      Add New Property
                    </button>
                  </div>

                  {/* Properties Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.properties && data.properties.length > 0 ? (
                      data.properties.map(property => (
                        <div key={property._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                          <div className="relative">
                            {property.images && property.images[0] && (
                              <img src={property.images[0]} alt={property.title} className="w-full h-48 object-cover" />
                            )}
                            <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Property
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="font-bold text-gray-800 text-lg mb-2">{property.title}</h3>
                            <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                              <Home className="w-4 h-4 text-gray-500" />
                              {property.location}
                            </div>
                            <p className="text-blue-600 font-bold text-xl mb-4">₹ {property.price?.toLocaleString()}</p>
                            <div className="flex gap-2">
                              <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-all">
                                <Eye className="w-4 h-4" /> View
                              </button>
                              <button
                                onClick={() => handleDelete('property', property._id)}
                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-all"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <Home className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 text-lg">No properties yet</p>
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
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <Plus className="w-5 h-5" />
                      Add New Land
                    </button>
                  </div>

                  {/* Lands Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.lands && data.lands.length > 0 ? (
                      data.lands.map(land => (
                        <div key={land._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                          <div className="relative">
                            {land.images && land.images[0] && (
                              <img src={land.images[0]} alt={land.title} className="w-full h-48 object-cover" />
                            )}
                            <div className="absolute top-3 right-3 bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Land
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="font-bold text-gray-800 text-lg mb-2">{land.title}</h3>
                            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                              <Landmark className="w-4 h-4 text-gray-500" />
                              {land.location}
                            </div>
                            <p className="text-gray-700 text-sm font-medium mb-3">📐 {land.area} acres</p>
                            <p className="text-yellow-600 font-bold text-xl mb-4">₹ {land.price?.toLocaleString()}</p>
                            <div className="flex gap-2">
                              <button className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-all">
                                <Eye className="w-4 h-4" /> View
                              </button>
                              <button
                                onClick={() => handleDelete('land', land._id)}
                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-all"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <Landmark className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 text-lg">No lands yet</p>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

