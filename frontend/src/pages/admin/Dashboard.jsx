import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Home, Landmark, MessageSquare, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import API_BASE_URL from '../../config/api';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
    return (
        <div className="bg-white p-6 rounded-none border-t-8 border-black shadow-lg hover:shadow-2xl transition-all h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 ${color} text-white`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
                <p className="text-3xl font-black text-black uppercase tracking-tighter">{value.toLocaleString()}</p>
            </div>
        </div>
    );
};


const AdminOverview = () => {
    const { stats } = useOutletContext();
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecentUsers = async () => {
        try {
            const opts = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
                },
            };
            const res = await axios.get(`${API_BASE_URL}/api/auth/users`, opts);
            const users = Array.isArray(res.data?.users) ? res.data.users : [];
            setRecentUsers(users.slice(0, 5));
        } catch (error) {
            console.error('Error fetching recent users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentUsers();
    }, []);

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-black" trend={12} />
                <StatCard title="Properties" value={stats.totalProperties} icon={Home} color="bg-black" trend={5} />
                <StatCard title="Available Lands" value={stats.totalLands} icon={Landmark} color="bg-black" trend={-2} />
                <StatCard title="New Messages" value={stats.totalMessages} icon={MessageSquare} color="bg-black" trend={8} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <div className="bg-white p-6 md:p-8 rounded-none border-t-8 border-black shadow-lg">
                    <h2 className="text-xl font-black uppercase tracking-tighter text-black mb-6 border-b-2 border-black pb-2 inline-block">
                        Recent User Registrations
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-4 border-black">
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Name</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Email</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Phone</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" className="text-center py-12 animate-pulse font-bold text-gray-400">LOADING DATA...</td></tr>
                                ) : recentUsers.map(user => (
                                    <tr key={user._id} className="border-b-2 border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-6 font-black text-black uppercase tracking-tight">{user.name}</td>
                                        <td className="px-6 py-6 font-bold text-gray-600">{user.email}</td>
                                        <td className="px-6 py-6 font-bold text-gray-600">{user.phone || 'N/A'}</td>
                                        <td className="px-6 py-6 font-bold text-gray-400">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
