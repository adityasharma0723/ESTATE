import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { HiUsers, HiCollection, HiClipboardList, HiStar, HiDocumentText, HiChartBar } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#B5651D', '#2F4F3F', '#965318', '#C4453A', '#d1823a', '#E8E4DD'];

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await API.get('/admin/analytics');
                setAnalytics(data);
            } catch { }
            setLoading(false);
        };
        fetch();
    }, []);

    const statCards = analytics ? [
        { icon: HiUsers, label: 'Users', value: analytics.stats.totalUsers, color: 'bg-primary' },
        { icon: HiUsers, label: 'Agents', value: analytics.stats.totalAgents, color: 'bg-secondary' },
        { icon: HiCollection, label: 'Properties', value: analytics.stats.totalProperties, color: 'bg-primary-dark' },
        { icon: HiClipboardList, label: 'Inquiries', value: analytics.stats.totalInquiries, color: 'bg-error' },
        { icon: HiStar, label: 'Reviews', value: analytics.stats.totalReviews, color: 'bg-primary' },
        { icon: HiDocumentText, label: 'Blogs', value: analytics.stats.totalBlogs, color: 'bg-secondary' },
        { icon: HiCollection, label: 'Pending Approval', value: analytics.stats.pendingProperties, color: 'bg-error' },
        { icon: HiChartBar, label: 'Active Listings', value: analytics.stats.activeListings, color: 'bg-primary-dark' },
    ] : [];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>

            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-24 skeleton rounded-xl" />)}
                </div>
            ) : analytics ? (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {statCards.map((card) => (
                            <div key={card.label} className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-5">
                                <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
                                    <card.icon className="w-5 h-5 text-white" />
                                </div>
                                <p className="font-mono text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                                <p className="text-xs text-gray-500 dark:text-dark-text">{card.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Monthly Users */}
                        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">New Users (Monthly)</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={analytics.charts.monthlyUsers.map(d => ({ month: months[d._id.month - 1], count: d.count }))}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                        <XAxis dataKey="month" fontSize={11} />
                                        <YAxis fontSize={11} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="count" stroke="#B5651D" strokeWidth={2} dot={{ fill: '#B5651D' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Property Types */}
                        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Property Type Distribution</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={analytics.charts.propertyTypes.map(d => ({ name: d._id, value: d.count }))} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                                            {analytics.charts.propertyTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Top Cities */}
                        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Cities</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analytics.charts.topCities.map(d => ({ city: d._id, count: d.count }))}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                        <XAxis dataKey="city" fontSize={11} />
                                        <YAxis fontSize={11} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#B5651D" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* For Sale vs Rent */}
                        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Sale vs Rent</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={[{ name: 'For Sale', value: analytics.stats.forSale }, { name: 'For Rent', value: analytics.stats.forRent }]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                                            <Cell fill="#2F4F3F" />
                                            <Cell fill="#B5651D" />
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-gray-500">Failed to load analytics</p>
            )}
        </div>
    );
};

export default AdminDashboard;
