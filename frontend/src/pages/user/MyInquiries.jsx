import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { formatDate, formatPrice } from '../../utils/helpers';

const MyInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await API.get('/inquiries/my');
                setInquiries(data.inquiries);
            } catch { }
            setLoading(false);
        };
        fetch();
    }, []);

    const statusColors = { pending: 'bg-yellow-100 text-yellow-700', responded: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-600' };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Inquiries</h1>
            {loading ? (
                <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 skeleton rounded-xl" />)}</div>
            ) : inquiries.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border">
                    <p className="text-5xl mb-4">📋</p>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No inquiries yet</h3>
                    <p className="text-gray-500 dark:text-dark-text mt-1">Send an inquiry on a property you&apos;re interested in.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {inquiries.map((inq) => (
                        <div key={inq._id} className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-5 flex flex-col sm:flex-row gap-4">
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={inq.property?.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{inq.property?.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-dark-text mt-1 line-clamp-1">{inq.message}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[inq.status]}`}>{inq.status}</span>
                                    <span className="text-xs text-gray-400">{formatDate(inq.createdAt)}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-primary">{formatPrice(inq.property?.price || 0)}</p>
                                <p className="text-xs text-gray-500 dark:text-dark-text mt-1">Agent: {inq.agent?.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyInquiries;
