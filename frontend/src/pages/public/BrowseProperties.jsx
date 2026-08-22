import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProperties, setFilters, resetFilters, addPropertyRealTime, updatePropertyRealTime, removePropertyRealTime } from '../../store/slices/propertySlice';
import PropertyCard from '../../components/property/PropertyCard';
import { HiAdjustments, HiX, HiSearch, HiHome, HiLocationMarker, HiShieldCheck } from 'react-icons/hi';
import { io } from 'socket.io-client';

const BrowseProperties = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { properties, pagination, loading, filters } = useSelector((state) => state.properties);
    const [showFilters, setShowFilters] = useState(false);
    // Local state for text inputs (city & search) to allow debouncing
    const [localCity, setLocalCity] = useState('');
    const [localSearch, setLocalSearch] = useState('');
    const debounceRef = useRef(null);

    // Sync URL params to filters on mount
    useEffect(() => {
        const params = {};
        for (const [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        if (Object.keys(params).length > 0) {
            dispatch(setFilters(params));
            // Sync local text state too
            if (params.city) setLocalCity(params.city);
            if (params.search) setLocalSearch(params.search);
        }
    }, []);

    // Fetch when filters change
    useEffect(() => {
        const params = {};
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params[key] = value;
        });
        dispatch(fetchProperties(params));
    }, [filters, dispatch]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        dispatch(setFilters(newFilters));
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v) params.set(k, v);
        });
        setSearchParams(params);
    };

    // Debounced handler for city and search text inputs
    const handleTextInputChange = (key, value, setter) => {
        setter(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            handleFilterChange(key, value.trim());
        }, 500);
    };

    const handleReset = () => {
        dispatch(resetFilters());
        setSearchParams({});
        setLocalCity('');
        setLocalSearch('');
    };

    const activeFilterCount = Object.values(filters).filter(v => v && v !== 'newest').length;

    // Real-time socket events
    useEffect(() => {
        const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

        socket.on('property_added', (property) => {
            dispatch(addPropertyRealTime(property));
        });

        socket.on('property_updated', (property) => {
            dispatch(updatePropertyRealTime(property));
        });

        socket.on('property_deleted', (propertyId) => {
            dispatch(removePropertyRealTime(propertyId));
        });

        socket.on('property_approved', (property) => {
            dispatch(updatePropertyRealTime(property));
        });

        return () => socket.disconnect();
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
            {/* Hero — Image background with adaptive overlay (matching Home) */}
            <div className="relative min-h-[70vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
                        alt="Luxury property"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/75 to-white/40 dark:from-dark/90 dark:via-dark/70 dark:to-dark/40" />
                </div>

                {/* Floating shapes */}
                <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-sm text-gray-700 dark:text-white/80 font-medium">Verified & RERA Compliant</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight animate-slide-up">
                            Find Your{' '}
                            <span className="bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent">
                                Perfect Property
                            </span>
                        </h1>
                        <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Browse thousands of verified listings across India — apartments, villas, plots, and commercial spaces.
                        </p>
                        <div className="flex gap-8 mt-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            {[
                                { value: `${pagination?.total || '10K+'}`, label: 'Properties' },
                                { value: '12+', label: 'Cities' },
                                { value: '500+', label: 'Agents' },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Type Filters — Horizontal bar below hero */}
            <div className="bg-white dark:bg-dark-card border-b border-gray-100 dark:border-dark-border">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3 overflow-x-auto">
                    <span className="text-xs font-medium text-gray-400 mr-1 flex-shrink-0">Quick filters:</span>
                    {['All', 'Apartment', 'Villa', 'House', 'Plot', 'Commercial', 'Penthouse'].map(type => (
                        <button key={type} onClick={() => handleFilterChange('propertyType', type === 'All' ? '' : type)}
                            className={`px-4 py-2 rounded-full text-sm font-medium flex-shrink-0 transition-all duration-300 ${(type === 'All' && !filters.propertyType) || filters.propertyType === type
                                ? 'bg-primary text-white'
                                : 'bg-gray-50 dark:bg-dark text-gray-600 dark:text-dark-text border border-gray-100 dark:border-dark-border hover:border-primary/40 hover:text-primary'
                                }`}>
                            {type}
                        </button>
                    ))}
                    <div className="ml-auto flex-shrink-0">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-full text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            <HiAdjustments className="w-4 h-4" />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">{activeFilterCount}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <div className={`${showFilters ? 'fixed inset-0 z-50 p-4 bg-black/50 lg:relative lg:inset-auto lg:p-0 lg:bg-transparent' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}>
                        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 max-h-[80vh] lg:max-h-none overflow-y-auto lg:sticky lg:top-24 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <HiAdjustments className="w-4 h-4 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                                </div>
                                <div className="flex gap-2 text-xs">
                                    <button onClick={handleReset} className="text-primary hover:text-primary-dark font-medium">Reset</button>
                                    <button onClick={() => setShowFilters(false)} className="lg:hidden"><HiX className="w-5 h-5 text-gray-500" /></button>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="mb-5">
                                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text mb-1.5 uppercase tracking-wider">Search</label>
                                <div className="relative">
                                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text" placeholder="Keywords..."
                                        value={localSearch}
                                        onChange={(e) => handleTextInputChange('search', e.target.value, setLocalSearch)}
                                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div className="mb-5">
                                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text mb-1.5 uppercase tracking-wider">Status</label>
                                <div className="flex gap-2">
                                    {['', 'For Sale', 'For Rent'].map((s) => (
                                        <button key={s} onClick={() => handleFilterChange('status', s)}
                                            className={`flex-1 py-2.5 text-xs font-medium rounded-xl transition-all duration-300 ${filters.status === s
                                                ? 'bg-primary text-white shadow-md shadow-primary/25'
                                                : 'bg-gray-50 dark:bg-dark text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-dark-border hover:border-primary/40'
                                                }`}>
                                            {s || 'All'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Property Type */}
                            <div className="mb-5">
                                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text mb-1.5 uppercase tracking-wider">Type</label>
                                <select value={filters.propertyType}
                                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                                    className="w-full py-2.5 px-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors">
                                    <option value="">All Types</option>
                                    <option value="Apartment">Apartment</option>
                                    <option value="Villa">Villa</option>
                                    <option value="House">House</option>
                                    <option value="Plot">Plot</option>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Penthouse">Penthouse</option>
                                </select>
                            </div>

                            {/* City */}
                            <div className="mb-5">
                                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text mb-1.5 uppercase tracking-wider">City</label>
                                <input type="text" placeholder="Enter city"
                                    value={localCity}
                                    onChange={(e) => handleTextInputChange('city', e.target.value, setLocalCity)}
                                    className="w-full py-2.5 px-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" />
                            </div>

                            {/* Price Range */}
                            <div className="mb-5">
                                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text mb-1.5 uppercase tracking-wider">Price Range</label>
                                <div className="flex gap-2">
                                    <input type="number" placeholder="Min" value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        className="w-1/2 py-2.5 px-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" />
                                    <input type="number" placeholder="Max" value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        className="w-1/2 py-2.5 px-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" />
                                </div>
                            </div>

                            {/* Bedrooms */}
                            <div className="mb-5">
                                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text mb-1.5 uppercase tracking-wider">Bedrooms</label>
                                <div className="flex gap-2">
                                    {['', '1', '2', '3', '4'].map((b) => (
                                        <button key={b} onClick={() => handleFilterChange('bedrooms', b)}
                                            className={`flex-1 py-2.5 text-xs font-medium rounded-xl transition-all duration-300 ${filters.bedrooms === b
                                                ? 'bg-primary text-white shadow-md shadow-primary/25'
                                                : 'bg-gray-50 dark:bg-dark text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-dark-border hover:border-primary/40'
                                                }`}>
                                            {b || 'Any'}{b && '+'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text mb-1.5 uppercase tracking-wider">Sort By</label>
                                <select value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="w-full py-2.5 px-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors">
                                    <option value="newest">Newest First</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="popular">Most Popular</option>
                                </select>
                            </div>

                            {/* Help card */}
                            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <HiShieldCheck className="w-4 h-4 text-primary" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">100% Verified</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-dark-text leading-relaxed">All properties on EstateX are verified by our team and RERA compliant.</p>
                            </div>
                        </div>
                    </div>

                    {/* Property Grid */}
                    <div className="flex-1">
                        {/* Results header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {filters.propertyType || 'All'} Properties
                                    {filters.city && <span className="text-primary"> in {filters.city}</span>}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-dark-text mt-0.5">
                                    Showing {properties.length} of {pagination?.total || 0} results
                                </p>
                            </div>
                            {activeFilterCount > 0 && (
                                <button onClick={handleReset}
                                    className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark">
                                    <HiX className="w-3.5 h-3.5" /> Clear all
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-dark-border">
                                        <div className="h-52 skeleton" />
                                        <div className="p-4 space-y-3">
                                            <div className="h-5 w-3/4 skeleton rounded" />
                                            <div className="h-4 w-1/2 skeleton rounded" />
                                            <div className="h-4 w-full skeleton rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border">
                                <div className="w-20 h-20 bg-gray-50 dark:bg-dark rounded-2xl flex items-center justify-center mx-auto mb-5">
                                    <HiHome className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No properties found</h3>
                                <p className="text-gray-500 dark:text-dark-text mt-2 max-w-sm mx-auto">Try adjusting your filters or search with different keywords.</p>
                                <button onClick={handleReset} className="mt-6 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-colors">
                                    Reset All Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {properties.map((property) => (
                                        <PropertyCard key={property._id} property={property} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination && pagination.pages > 1 && (
                                    <div className="flex justify-center mt-12 gap-2">
                                        <button
                                            onClick={() => pagination.page > 1 && handleFilterChange('page', (pagination.page - 1).toString())}
                                            disabled={pagination.page === 1}
                                            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors">
                                            ← Prev
                                        </button>
                                        {Array.from({ length: pagination.pages }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleFilterChange('page', (i + 1).toString())}
                                                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-300 ${pagination.page === i + 1
                                                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                                                    : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-border hover:border-primary hover:text-primary'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => pagination.page < pagination.pages && handleFilterChange('page', (pagination.page + 1).toString())}
                                            disabled={pagination.page === pagination.pages}
                                            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors">
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* CTA — Image background (matching About CTA section) */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="relative rounded-3xl overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"
                        alt="Modern home"
                        className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/50 flex items-center">
                        <div className="px-10 sm:px-16">
                            <h3 className="text-2xl sm:text-3xl font-bold text-white">Can&apos;t find what you&apos;re looking for?</h3>
                            <p className="text-white/60 mt-2">Our agents can help you find the perfect property. Get in touch today.</p>
                            <a href="/contact" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors">
                                Contact an Agent →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrowseProperties;
