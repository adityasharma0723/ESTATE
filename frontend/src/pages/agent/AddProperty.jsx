import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const amenityOptions = ['Parking', 'Swimming Pool', 'Gym', 'Garden', 'Security', 'Elevator', 'Power Backup', 'CCTV', 'Clubhouse', 'Play Area', 'Intercom', 'Fire Safety', 'Rain Water Harvesting', 'Wi-Fi', 'AC'];

const AddProperty = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [form, setForm] = useState({
        title: '', description: '', price: '', propertyType: 'Apartment', bedrooms: '', bathrooms: '',
        area: '', address: '', city: '', state: '', pincode: '', status: 'For Sale', lat: '', lng: '',
        amenities: [],
    });

    const toggleAmenity = (a) => {
        setForm(prev => ({
            ...prev,
            amenities: prev.amenities.includes(a) ? prev.amenities.filter(x => x !== a) : [...prev.amenities, a],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (key === 'amenities') formData.append(key, value.join(','));
                else formData.append(key, value);
            });
            images.forEach((img) => formData.append('images', img));

            await API.post('/properties', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Property submitted for approval!');
            navigate('/agent/listings');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create property');
        }
        setLoading(false);
    };

    const inputCls = 'w-full px-4 py-2.5 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary';

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Property</h1>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 space-y-6">
                {/* Basic Info */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="e.g. Modern 3BHK Apartment in Bandra" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} placeholder="Describe the property..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                            <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} placeholder="5000000" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property Type</label>
                            <select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })} className={inputCls}>
                                {['Apartment', 'Villa', 'House', 'Plot', 'Commercial', 'Penthouse'].map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
                                <option>For Sale</option>
                                <option>For Rent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Area (sqft)</label>
                            <input type="number" required value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bedrooms</label>
                            <input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bathrooms</label>
                            <input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className={inputCls} />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                            <input type="text" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} />
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                            <input type="text" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                            <input type="text" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputCls} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pincode</label>
                            <input type="text" required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className={inputCls} /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latitude</label>
                            <input type="text" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} className={inputCls} placeholder="19.0760" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Longitude</label>
                            <input type="text" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} className={inputCls} placeholder="72.8777" /></div>
                    </div>
                </div>

                {/* Amenities */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Amenities</h2>
                    <div className="flex flex-wrap gap-2">
                        {amenityOptions.map((a) => (
                            <button key={a} type="button" onClick={() => toggleAmenity(a)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${form.amenities.includes(a) ? 'bg-primary text-white border-primary' : 'bg-gray-50 dark:bg-dark text-gray-600 dark:text-gray-400 border-gray-200 dark:border-dark-border'
                                    }`}>
                                {a}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Images</h2>
                    <input type="file" multiple accept="image/*" onChange={(e) => setImages([...e.target.files])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    {images.length > 0 && (
                        <div className="flex gap-2 mt-3">
                            {Array.from(images).map((img, i) => (
                                <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button type="submit" disabled={loading}
                    className="px-8 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold rounded-xl">
                    {loading ? 'Submitting...' : 'Submit Property'}
                </button>
            </form>
        </div>
    );
};

export default AddProperty;
