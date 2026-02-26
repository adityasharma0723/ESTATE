import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPropertyById, clearCurrent } from '../../store/slices/propertySlice';
import { formatPrice, formatDate } from '../../utils/helpers';
import { HiLocationMarker, HiHeart, HiPhone, HiMail, HiShare, HiScale, HiStar } from 'react-icons/hi';
import { IoBedOutline, IoWaterOutline, IoResizeOutline } from 'react-icons/io5';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const PropertyDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { current: property, loading } = useSelector((state) => state.properties);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [activeImg, setActiveImg] = useState(0);
    const [inquiry, setInquiry] = useState({ message: '', phone: '' });
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        dispatch(fetchPropertyById(id));
        fetchReviews();
        return () => dispatch(clearCurrent());
    }, [id, dispatch]);

    const fetchReviews = async () => {
        try {
            const { data } = await API.get(`/reviews/property/${id}`);
            setReviews(data.reviews);
            setAvgRating(data.avgRating);
        } catch { }
    };

    const handleInquiry = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return toast.error('Please login to send inquiry');
        try {
            await API.post('/inquiries', { propertyId: id, ...inquiry });
            toast.success('Inquiry sent! The agent will contact you soon.');
            setInquiry({ message: '', phone: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send inquiry');
        }
    };

    const handleReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return toast.error('Please login to post a review');
        try {
            await API.post('/reviews', { propertyId: id, ...reviewForm });
            toast.success('Review posted!');
            setReviewForm({ rating: 5, comment: '' });
            fetchReviews();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to post review');
        }
    };

    const handleSave = async () => {
        if (!isAuthenticated) return toast.error('Please login to save properties');
        try {
            await API.post(`/saved/${id}`);
            toast.success('Property saved!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving');
        }
    };

    if (loading || !property) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="h-96 skeleton rounded-2xl mb-8" />
                    <div className="h-8 w-1/2 skeleton rounded mb-4" />
                    <div className="h-4 w-1/3 skeleton rounded" />
                </div>
            </div>
        );
    }

    const images = property.images?.length > 0 ? property.images : [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-dark-text mb-6">
                    <Link to="/" className="hover:text-primary">Home</Link>
                    <span>/</span>
                    <Link to="/properties" className="hover:text-primary">Properties</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white">{property.title}</span>
                </nav>

                {/* Gallery */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                    <div className="rounded-2xl overflow-hidden h-80 lg:h-[500px]">
                        <img src={images[activeImg]} alt={property.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {images.slice(0, 4).map((img, i) => (
                            <button key={i} onClick={() => setActiveImg(i)} className={`rounded-xl overflow-hidden h-36 lg:h-[240px] border-2 transition-colors ${activeImg === i ? 'border-primary' : 'border-transparent'}`}>
                                <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header */}
                        <div>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex gap-2 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${property.status === 'For Sale' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                                            {property.status}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-400">
                                            {property.propertyType}
                                        </span>
                                        {property.isFeatured && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-600">Featured</span>
                                        )}
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{property.title}</h1>
                                    <div className="flex items-center mt-2 text-gray-500 dark:text-dark-text">
                                        <HiLocationMarker className="w-5 h-5 mr-1 text-primary" />
                                        <span>{property.address}, {property.city}, {property.state} - {property.pincode}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-primary">{formatPrice(property.price)}</p>
                                    {property.status === 'For Rent' && <small className="text-gray-500">/month</small>}
                                </div>
                            </div>

                            {/* Quick stats */}
                            <div className="flex flex-wrap gap-4 mt-6 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border">
                                {property.bedrooms > 0 && (
                                    <div className="flex items-center gap-2 pr-4 border-r border-gray-200 dark:border-dark-border">
                                        <IoBedOutline className="w-5 h-5 text-primary" />
                                        <div><p className="font-semibold text-gray-900 dark:text-white">{property.bedrooms}</p><p className="text-xs text-gray-500">Bedrooms</p></div>
                                    </div>
                                )}
                                {property.bathrooms > 0 && (
                                    <div className="flex items-center gap-2 pr-4 border-r border-gray-200 dark:border-dark-border">
                                        <IoWaterOutline className="w-5 h-5 text-primary" />
                                        <div><p className="font-semibold text-gray-900 dark:text-white">{property.bathrooms}</p><p className="text-xs text-gray-500">Bathrooms</p></div>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 pr-4 border-r border-gray-200 dark:border-dark-border">
                                    <IoResizeOutline className="w-5 h-5 text-primary" />
                                    <div><p className="font-semibold text-gray-900 dark:text-white">{property.area}</p><p className="text-xs text-gray-500">Sq Ft</p></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HiStar className="w-5 h-5 text-amber-400" />
                                    <div><p className="font-semibold text-gray-900 dark:text-white">{avgRating || 'N/A'}</p><p className="text-xs text-gray-500">{reviews.length} Reviews</p></div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-4">
                                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                                    <HiHeart className="w-4 h-4" /> Save
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-400 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                                    <HiShare className="w-4 h-4" /> Share
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors">
                                    <HiScale className="w-4 h-4" /> Compare
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
                            <p className="text-gray-600 dark:text-dark-text leading-relaxed whitespace-pre-line">{property.description}</p>
                        </div>

                        {/* Amenities */}
                        {property.amenities?.length > 0 && (
                            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Amenities</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {property.amenities.map((a, i) => (
                                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-dark rounded-lg text-sm text-gray-700 dark:text-gray-300">
                                            <span className="text-primary">✓</span> {a}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Reviews ({reviews.length})</h2>
                            {reviews.length === 0 ? (
                                <p className="text-gray-500 dark:text-dark-text">No reviews yet. Be the first!</p>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((r) => (
                                        <div key={r._id} className="p-4 bg-gray-50 dark:bg-dark rounded-xl">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                                                        {r.user?.name?.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-gray-900 dark:text-white text-sm">{r.user?.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: r.rating }).map((_, j) => (
                                                        <HiStar key={j} className="w-4 h-4 text-amber-400" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-dark-text">{r.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Review form */}
                            {isAuthenticated && (
                                <form onSubmit={handleReview} className="mt-6 pt-6 border-t border-gray-100 dark:border-dark-border">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Write a Review</h3>
                                    <div className="flex gap-2 mb-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                                                <HiStar className={`w-6 h-6 ${star <= reviewForm.rating ? 'text-amber-400' : 'text-gray-300'}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                        placeholder="Share your experience..." rows={3}
                                        className="w-full p-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary" />
                                    <button type="submit" className="mt-3 px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark">
                                        Submit Review
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Agent card */}
                        {property.agent && (
                            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Listed By</h3>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                                        {property.agent.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{property.agent.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-dark-text">Verified Agent</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <a href={`mailto:${property.agent.email}`} className="flex items-center gap-2 text-gray-600 dark:text-dark-text hover:text-primary">
                                        <HiMail className="w-4 h-4" /> {property.agent.email}
                                    </a>
                                    {property.agent.phone && (
                                        <a href={`tel:${property.agent.phone}`} className="flex items-center gap-2 text-gray-600 dark:text-dark-text hover:text-primary">
                                            <HiPhone className="w-4 h-4" /> {property.agent.phone}
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Inquiry form */}
                        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Send Inquiry</h3>
                            <form onSubmit={handleInquiry} className="space-y-3">
                                <input type="tel" placeholder="Phone number" value={inquiry.phone}
                                    onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                                    className="w-full p-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary" />
                                <textarea placeholder="I'm interested in this property..." value={inquiry.message}
                                    onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })} rows={4}
                                    className="w-full p-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary" required />
                                <button type="submit" className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors">
                                    Send Inquiry
                                </button>
                            </form>
                        </div>

                        {/* Details */}
                        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Details</h3>
                            <dl className="space-y-3 text-sm">
                                {[
                                    ['Property ID', property._id?.slice(-8)],
                                    ['Type', property.propertyType],
                                    ['Status', property.status],
                                    ['Area', `${property.area} sqft`],
                                    ['City', property.city],
                                    ['State', property.state],
                                    ['Pincode', property.pincode],
                                    ['Listed', formatDate(property.createdAt)],
                                    ['Views', property.views],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex justify-between">
                                        <dt className="text-gray-500 dark:text-dark-text">{label}</dt>
                                        <dd className="font-medium text-gray-900 dark:text-white">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
