import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { HiTrash, HiStar } from 'react-icons/hi';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ManageReviews = () => {
    const [reviews, setReviews] = useState([]);

    const fetchReviews = async () => {
        try {
            const { data } = await API.get('/reviews');
            setReviews(data.reviews);
        } catch { }
    };

    useEffect(() => { fetchReviews(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this review?')) return;
        try {
            await API.delete(`/reviews/${id}`);
            toast.success('Review deleted');
            fetchReviews();
        } catch { toast.error('Failed'); }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Reviews</h1>
            <div className="space-y-4">
                {reviews.map((r) => (
                    <div key={r._id} className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-5 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 dark:text-white">{r.user?.name}</span>
                                <span className="text-xs text-gray-400">on</span>
                                <span className="font-medium text-primary text-sm">{r.property?.title}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                                {Array.from({ length: r.rating }).map((_, i) => <HiStar key={i} className="w-4 h-4 text-amber-400" />)}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-dark-text mt-2">{r.comment}</p>
                            <p className="text-xs text-gray-400 mt-2">{formatDate(r.createdAt)}</p>
                        </div>
                        <button onClick={() => handleDelete(r._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50"><HiTrash className="w-4 h-4" /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageReviews;
