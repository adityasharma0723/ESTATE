import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { formatPrice, formatDate } from '../../utils/helpers';
import { HiPencil, HiTrash, HiEye, HiStar } from 'react-icons/hi';
import toast from 'react-hot-toast';

const MyListings = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchListings = async () => {
        try {
            const { data } = await API.get('/properties/my-listings');
            setProperties(data.properties);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchListings(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this property?')) return;
        try {
            await API.delete(`/properties/${id}`);
            toast.success('Property deleted');
            fetchListings();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const handleFeature = async (id) => {
        try {
            const { data } = await API.post('/payments/create-checkout', { propertyId: id });
            window.location.href = data.url;
        } catch {
            toast.error('Payment unavailable in demo mode');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Listings</h1>
                <Link to="/agent/add-property" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark">+ Add New</Link>
            </div>

            {loading ? (
                <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 skeleton rounded-xl" />)}</div>
            ) : properties.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border">
                    <p className="text-5xl mb-4">🏠</p>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No listings yet</h3>
                    <Link to="/agent/add-property" className="text-primary font-medium mt-2 inline-block">Add your first property →</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {properties.map((p) => (
                        <div key={p._id} className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-4 flex flex-col sm:flex-row gap-4">
                            <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{p.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-dark-text">{p.city}, {p.state}</p>
                                    </div>
                                    <span className="font-bold text-primary">{formatPrice(p.price)}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-3">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {p.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1"><HiEye className="w-3 h-3" />{p.views} views</span>
                                    <span className="text-xs text-gray-400">{formatDate(p.createdAt)}</span>
                                </div>
                            </div>
                            <div className="flex sm:flex-col gap-2">
                                <Link to={`/properties/${p._id}`} className="p-2 rounded-lg bg-gray-100 dark:bg-dark text-gray-600 dark:text-gray-400 hover:bg-gray-200"><HiEye className="w-4 h-4" /></Link>
                                <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><HiTrash className="w-4 h-4" /></button>
                                {!p.isFeatured && (
                                    <button onClick={() => handleFeature(p._id)} className="p-2 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100" title="Feature this listing"><HiStar className="w-4 h-4" /></button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyListings;
