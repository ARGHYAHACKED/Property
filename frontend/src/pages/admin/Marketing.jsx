import React from 'react';
import { Facebook, Instagram, Globe, Layout, Plus, ExternalLink, Settings2, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketingCard = ({ title, icon: Icon, description, lastSync, status, link }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white p-10 rounded-none border-t-8 border-black shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col justify-between group">
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div className="bg-black text-white p-5">
                        <Icon className="w-10 h-10" />
                    </div>
                     <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-black">{status}</span>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-black">{title}</h3>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed italic border-l-4 border-black pl-3 py-2">
                        {description}
                    </p>
                </div>
                
                <div className="bg-gray-50 p-6 flex items-center justify-between border-b-2 border-gray-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Last Synced</span>
                    <span className="text-xs font-black uppercase tracking-tighter text-black">{lastSync}</span>
                </div>
            </div>

            <div className="mt-10 flex gap-4">
                <button 
                    onClick={() => link && navigate(link)}
                    className="flex-grow bg-black text-white py-4 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transform active:scale-95 transition-all hover:bg-gray-800"
                >
                    <Settings2 className="w-5 h-5"/> Manage
                </button>
                <button className="bg-white text-black border-4 border-black py-4 px-6 font-black uppercase tracking-widest text-xs transform active:scale-95 transition-all hover:bg-gray-100">
                    <BarChart3 className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
};

const AdminMarketing = () => {
    const marketingStats = [
        {
            title: 'Facebook',
            icon: Facebook,
            description: 'Automated listing sharing and lead capture integration for 55acre Facebook Page.',
            lastSync: '2 Hours Ago',
            status: 'Active'
        },
        {
            title: 'Instagram',
            icon: Instagram,
            description: 'Visual asset syndication and direct message lead generation management.',
            lastSync: '1 Day Ago',
            status: 'Active'
        },
        {
            title: 'SEO Engine',
            icon: Globe,
            description: 'Organic search performance monitoring and automated metadata optimization.',
            lastSync: 'Just Now',
            status: 'Active'
        },
        {
            title: 'Web Banner',
            icon: Layout,
            description: 'Homepage dynamic banner sequences and promotional campaign management.',
            lastSync: 'N/A',
            status: 'Standby',
            link: '/admin/marketing/banner'
        }
    ];

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-8 border-black pb-8 overflow-hidden">
                <div className="space-y-2">
                    <h2 className="text-5xl font-black uppercase tracking-tighter text-black">Campaign Center</h2>
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Multi-Channel Marketing Distribution Agent</p>
                </div>
                <button className="bg-black text-white px-10 py-5 font-black uppercase tracking-widest rounded-none border-4 border-black flex items-center gap-3 active:scale-95 transition-transform">
                    <Plus className="w-7 h-7" /> Deploy New Campaign
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                {marketingStats.map((item, index) => (
                    <MarketingCard key={index} {...item} />
                ))}
            </div>

            <div className="bg-black p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -mr-32 -mt-32 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <h4 className="text-4xl font-black uppercase tracking-tighter text-white">Aggregated Performance Metrics</h4>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Omni-channel conversion tracking system enabled.</p>
                    </div>
                    <button className="bg-white text-black px-12 py-6 font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform flex items-center gap-3">
                        <BarChart3 className="w-6 h-6"/> View Full Matrix
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminMarketing;
