import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AgentAnalytics = () => {
    const [listings, setListings] = useState([]);
    const [inquiries, setInquiries] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [listRes, inqRes] = await Promise.all([
                    API.get('/properties/my-listings?limit=100'),
                    API.get('/inquiries/agent'),
                ]);
                setListings(listRes.data.properties);
                setInquiries(inqRes.data.inquiries);
            } catch { }
        };
        fetchData();
    }, []);

    const viewsData = listings.slice(0, 8).map(p => ({ name: p.title.slice(0, 20), views: p.views || 0 }));
    const typeData = listings.reduce((acc, p) => {
        const existing = acc.find(a => a.name === p.propertyType);
        if (existing) existing.value++;
        else acc.push({ name: p.propertyType, value: 1 });
        return acc;
    }, []);

    const pendingInq = inquiries.filter(i => i.status === 'pending').length;
    const respondedInq = inquiries.filter(i => i.status === 'responded').length;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Analytics</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Listings', value: listings.length },
                    { label: 'Total Views', value: listings.reduce((a, p) => a + (p.views || 0), 0) },
                    { label: 'Pending Inquiries', value: pendingInq },
                    { label: 'Responded', value: respondedInq },
                ].map((s) => (
                    <div key={s.label} className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-5">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                        <p className="text-sm text-gray-500 dark:text-dark-text">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Views chart */}
                <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Property Views</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={viewsData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="name" fontSize={11} />
                                <YAxis fontSize={11} />
                                <Tooltip />
                                <Bar dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Type distribution */}
                <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Property Types</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={typeData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                                    {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentAnalytics;
