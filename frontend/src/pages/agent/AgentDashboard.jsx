import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { formatPrice } from '../../utils/helpers';
import { HiPlus, HiCollection, HiChartBar, HiEye, HiClipboardList } from 'react-icons/hi';

const AgentDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState({ listings: 0, totalViews: 0, inquiries: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [listRes, inqRes] = await Promise.all([
                    API.get('/properties/my-listings?limit=100'),
                    API.get('/inquiries/agent'),
                ]);
                const totalViews = listRes.data.properties.reduce((acc, p) => acc + (p.views || 0), 0);
                setStats({ listings: listRes.data.pagination.total, totalViews, inquiries: inqRes.data.inquiries.length });
            } catch { }
        };
        fetchStats();
    }, []);

    const cards = [
        { icon: HiCollection, label: 'My Listings', value: stats.listings, to: '/agent/listings', color: 'from-primary to-secondary' },
        { icon: HiEye, label: 'Total Views', value: stats.totalViews, to: '/agent/analytics', color: 'from-emerald-500 to-green-500' },
        { icon: HiClipboardList, label: 'Inquiries', value: stats.inquiries, to: '/agent/analytics', color: 'from-amber-500 to-orange-500' },
        { icon: HiPlus, label: 'Add Property', value: '+', to: '/agent/add-property', color: 'from-violet-500 to-purple-500' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agent Dashboard</h1>
                <p className="text-gray-500 dark:text-dark-text mt-1">Welcome back, {user?.name} 🏡</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <Link key={card.label} to={card.to}
                        className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 hover:shadow-lg transition-all group">
                        <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <card.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                        <p className="text-sm text-gray-500 dark:text-dark-text mt-1">{card.label}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AgentDashboard;
