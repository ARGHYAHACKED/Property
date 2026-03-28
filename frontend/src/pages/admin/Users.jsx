import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserPlus, Filter } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const opts = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
                },
            };
            const res = await axios.get(`${API_BASE_URL}/api/auth/users`, opts);
            setUsers(Array.isArray(res.data?.users) ? res.data.users : []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-8 border-black pb-8">
                <h2 className="text-5xl font-black uppercase tracking-tighter text-black">Manage Users</h2>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:w-80">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="SEARCH USERS..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border-4 border-black rounded-none shadow-sm focus:outline-none focus:ring-0 placeholder-gray-400 font-bold uppercase tracking-widest text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                 <div className="bg-white p-12 rounded-none shadow-2xl border-t-8 border-black overflow-x-auto min-h-[500px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-4 border-black">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Name</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Email Address</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Phone</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Date Joined</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-12 animate-pulse font-bold text-gray-400 uppercase tracking-widest">Retrieving User Records...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-12 font-black text-black opacity-50 uppercase tracking-widest">No users found matching your search.</td></tr>
                            ) : filteredUsers.map(user => (
                                <tr key={user._id} className="border-b-2 border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-6 font-black text-black uppercase tracking-tight">{user.name}</td>
                                    <td className="px-6 py-6 font-bold text-gray-600 truncate max-w-xs">{user.email}</td>
                                    <td className="px-6 py-6 font-bold text-gray-600">{user.phone || ' — '}</td>
                                    <td className="px-6 py-6 font-bold text-gray-400">
                                        {user.createdAt 
                                            ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
                                            : 'N/A'}
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                            <span className="text-xs font-black uppercase tracking-widest text-black">Active</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
