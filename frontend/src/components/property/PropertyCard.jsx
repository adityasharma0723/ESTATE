import { Link } from 'react-router-dom';
import { HiHeart, HiLocationMarker, HiScale } from 'react-icons/hi';
import { IoBedOutline, IoWaterOutline, IoResizeOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { addToCompare, removeFromCompare } from '../../store/slices/uiSlice';
import { formatPrice } from '../../utils/helpers';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { useState } from 'react';

const PropertyCard = ({ property, onSaveToggle }) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { compareList } = useSelector((state) => state.ui);
    const [saved, setSaved] = useState(false);

    const isInCompare = compareList.find(p => p._id === property._id);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return toast.error('Please login to save properties');
        try {
            if (saved) {
                await API.delete(`/saved/${property._id}`);
                setSaved(false);
                toast.success('Removed from saved');
            } else {
                await API.post(`/saved/${property._id}`);
                setSaved(true);
                toast.success('Property saved!');
            }
            onSaveToggle?.();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error');
        }
    };

    const handleCompare = (e) => {
        e.preventDefault();
        if (isInCompare) {
            dispatch(removeFromCompare(property._id));
            toast.success('Removed from comparison');
        } else if (compareList.length >= 3) {
            toast.error('You can compare up to 3 properties');
        } else {
            dispatch(addToCompare(property));
            toast.success('Added to comparison');
        }
    };

    return (
        <Link
            to={`/properties/${property._id}`}
            className="group block bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-dark-border hover:border-primary/30"
        >
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
                <img
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${property.status === 'For Sale' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}>
                        {property.status}
                    </span>
                    {property.isFeatured && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-amber-500">
                            Featured
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="absolute top-3 right-3 flex gap-2">
                    <button
                        onClick={handleSave}
                        className={`p-2 rounded-full backdrop-blur-sm transition-colors ${saved ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'
                            }`}
                    >
                        <HiHeart className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleCompare}
                        className={`p-2 rounded-full backdrop-blur-sm transition-colors ${isInCompare ? 'bg-primary text-white' : 'bg-white/20 text-white hover:bg-white/40'
                            }`}
                    >
                        <HiScale className="w-4 h-4" />
                    </button>
                </div>

                {/* Price */}
                <div className="absolute bottom-3 left-3">
                    <span className="text-xl font-bold text-white">{formatPrice(property.price)}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                    {property.title}
                </h3>

                <div className="flex items-center mt-2 text-gray-500 dark:text-dark-text">
                    <HiLocationMarker className="w-4 h-4 mr-1 text-primary" />
                    <span className="text-sm line-clamp-1">{property.city}, {property.state}</span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-dark-border">
                    <div className="flex items-center space-x-4 text-gray-500 dark:text-dark-text">
                        {property.bedrooms > 0 && (
                            <div className="flex items-center space-x-1">
                                <IoBedOutline className="w-4 h-4" />
                                <span className="text-xs">{property.bedrooms} Beds</span>
                            </div>
                        )}
                        {property.bathrooms > 0 && (
                            <div className="flex items-center space-x-1">
                                <IoWaterOutline className="w-4 h-4" />
                                <span className="text-xs">{property.bathrooms} Baths</span>
                            </div>
                        )}
                        <div className="flex items-center space-x-1">
                            <IoResizeOutline className="w-4 h-4" />
                            <span className="text-xs">{property.area} sqft</span>
                        </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 dark:bg-dark/50 text-gray-600 dark:text-dark-text">
                        {property.propertyType}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;
