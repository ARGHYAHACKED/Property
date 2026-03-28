import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, Users, Home, Landmark, MessageSquare, 
  FileCheck, LogOut, ChevronLeft, ChevronRight, LayoutDashboard,
  Menu, X
} from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProperties: 0,
        totalLands: 0,
        totalMessages: 0
    });
    const navigate = useNavigate();
    const location = useLocation();

    const fetchStats = async () => {
        try {
            const opts = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
                },
            };
            const [usersRes, propertiesRes, landsRes, messagesRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/auth/users`, opts).catch(() => ({ data: { users: [] } })),
                axios.get(`${API_BASE_URL}/api/properties`, opts).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/api/lands`, opts).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/api/messages`, opts).catch(() => ({ data: { messages: [] } }))
            ]);

            setStats({
                totalUsers: Array.isArray(usersRes.data?.users) ? usersRes.data.users.length : 0,
                totalProperties: Array.isArray(propertiesRes.data) ? propertiesRes.data.length : 0,
                totalLands: Array.isArray(landsRes.data) ? landsRes.data.length : 0,
                totalMessages: Array.isArray(messagesRes.data?.messages) ? messagesRes.data.messages.length : 0
            });
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        document.cookie = 'adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/admin/login');
    };

    const sidebarItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/user', icon: Users, label: 'Users' },
        { path: '/admin/properties', icon: Home, label: 'Properties' },
        { path: '/admin/lands', icon: Landmark, label: 'Lands' },
        { path: '/admin/messages', icon: MessageSquare, label: 'Messages' },
        { path: '/admin/requests', icon: FileCheck, label: 'Requests' },
        { path: '/admin/marketing/webbanner', icon: LayoutDashboard, label: 'Banner Property' },
        { path: '/admin/marketing', icon: BarChart3, label: 'Marketing' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`bg-black text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col fixed h-screen z-50`}>
                <div className="p-6 flex items-center justify-between border-b border-gray-800">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-2 overflow-hidden">
                            <BarChart3 className="w-8 h-8 text-white min-w-[32px]" />
                            <span className="font-black text-xl uppercase tracking-tighter whitespace-nowrap">Admin Panel</span>
                        </div>
                    ) : (
                        <BarChart3 className="w-8 h-8 mx-auto" />
                    )}
                </div>

                <nav className="flex-grow py-8 overflow-y-auto no-scrollbar">
                    <ul className="space-y-2 px-3">
                        {sidebarItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex items-center gap-4 px-4 py-4 rounded-none transition-all duration-200
                                        ${isActive ? 'bg-white text-black font-black' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}
                                        ${!isSidebarOpen && 'justify-center'}
                                    `}
                                >
                                    <item.icon className="w-6 h-6 min-w-[24px]" />
                                    {isSidebarOpen && <span className="uppercase tracking-widest text-xs font-bold">{item.label}</span>}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button 
                        onClick={handleLogout}
                        className={`
                            flex items-center gap-4 px-4 py-4 rounded-none transition-all duration-200 w-full
                            text-red-500 hover:bg-red-500 hover:text-white
                            ${!isSidebarOpen && 'justify-center'}
                        `}
                    >
                        <LogOut className="w-6 h-6 min-w-[24px]" />
                        {isSidebarOpen && <span className="uppercase tracking-widest text-xs font-bold">Sign Out</span>}
                    </button>
                    
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="mt-4 flex items-center justify-center w-full py-2 text-gray-500 hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} min-h-screen flex flex-col`}>
                <header className="bg-white border-b-4 border-black sticky top-0 z-40 h-20 flex items-center px-8 justify-between">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-black">
                            {sidebarItems.find(item => location.pathname.includes(item.path))?.label || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Administrator</span>
                            <span className="text-sm font-black text-black">ADMIN MODE</span>
                        </div>
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-black">
                            A
                        </div>
                    </div>
                </header>

                <div className="p-8 flex-grow">
                    <Outlet context={{ stats, fetchStats }} />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
