import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { formatPrice, formatDate } from '../../utils/helpers';
import { HiCheck, HiX, HiTrash, HiEye } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ManageProperties = () => {
    const [properties, setProperties] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    const fetchProperties = async () => {
        try {
            const params = { limit: 50 };
            if (filter === 'pending') params.isApproved = 'false';
            if (filter === 'approved') params.isApproved = 'true';
            const { data } = await API.get('/properties/admin/all', { params });
            setProperties(data.properties);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchProperties(); }, [filter]);

    const handleApprove = async (id, approve) => {
        try {
            await API.put(`/properties/${id}/approve`, { isApproved: approve });
            toast.success(approve ? 'Property approved' : 'Property rejected');
            fetchProperties();
        } catch { toast.error('Failed'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this property?')) return;
        try {
            await API.delete(`/properties/${id}`);
            toast.success('Property deleted');
            fetchProperties();
        } catch { toast.error('Failed'); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Properties</h1>
                <div className="flex gap-2">
                    {['all', 'pending', 'approved'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize ${filter === f ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark text-gray-600 dark:text-gray-400'}`}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {properties.map((p) => (
                    <div key={p._id} className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-4 flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-28 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{p.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-dark-text">{p.city}, {p.state} · Agent: {p.agent?.name || 'N/A'}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="font-bold text-primary text-sm">{formatPrice(p.price)}</span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {p.isApproved ? 'Approved' : 'Pending'}
                                </span>
                                <span className="text-xs text-gray-400">{formatDate(p.createdAt)}</span>
                            </div>
                        </div>
                        <div className="flex sm:flex-col gap-2">
                            <Link to={`/properties/${p._id}`} className="p-2 rounded-lg bg-gray-100 dark:bg-dark text-gray-600 dark:text-gray-400 hover:bg-gray-200"><HiEye className="w-4 h-4" /></Link>
                            {!p.isApproved && (
                                <button onClick={() => handleApprove(p._id, true)} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"><HiCheck className="w-4 h-4" /></button>
                            )}
                            {p.isApproved && (
                                <button onClick={() => handleApprove(p._id, false)} className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100"><HiX className="w-4 h-4" /></button>
                            )}
                            <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><HiTrash className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageProperties;
