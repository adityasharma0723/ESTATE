import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { HiHeart, HiClipboardList, HiChat, HiUser } from 'react-icons/hi';

const UserDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState({ saved: 0, inquiries: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [savedRes, inquiryRes] = await Promise.all([
                    API.get('/saved'),
                    API.get('/inquiries/my'),
                ]);
                setStats({ saved: savedRes.data.saved.length, inquiries: inquiryRes.data.inquiries.length });
            } catch { }
        };
        fetchStats();
    }, []);

    const cards = [
        { icon: HiHeart, label: 'Saved Properties', value: stats.saved, to: '/saved', color: 'bg-error' },
        { icon: HiClipboardList, label: 'My Inquiries', value: stats.inquiries, to: '/inquiries', color: 'bg-primary' },
        { icon: HiChat, label: 'Messages', value: '—', to: '/chat', color: 'bg-secondary' },
        { icon: HiUser, label: 'Profile', value: '→', to: '/settings', color: 'bg-primary-dark' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name} 👋</h1>
                <p className="text-gray-500 dark:text-dark-text mt-1">Here&apos;s what&apos;s happening with your account</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <Link key={card.label} to={card.to}
                        className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 hover:shadow-lg transition-all group">
                        <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <card.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-mono text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                        <p className="text-sm text-gray-500 dark:text-dark-text mt-1">{card.label}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default UserDashboard;
