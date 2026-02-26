import { useEffect, useState } from 'react';
import API from '../../api/axios';
import PropertyCard from '../../components/property/PropertyCard';

const SavedProperties = () => {
    const [saved, setSaved] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSaved = async () => {
        try {
            const { data } = await API.get('/saved');
            setSaved(data.saved);
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchSaved(); }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Saved Properties</h1>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-72 skeleton rounded-2xl" />)}
                </div>
            ) : saved.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border">
                    <p className="text-5xl mb-4">💝</p>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No saved properties yet</h3>
                    <p className="text-gray-500 dark:text-dark-text mt-1">Browse properties and click the heart icon to save them.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {saved.map((s) => s.property && <PropertyCard key={s._id} property={s.property} onSaveToggle={fetchSaved} />)}
                </div>
            )}
        </div>
    );
};

export default SavedProperties;
