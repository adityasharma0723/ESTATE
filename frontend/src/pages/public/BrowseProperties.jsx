import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProperties, setFilters, resetFilters } from '../../store/slices/propertySlice';
import PropertyCard from '../../components/property/PropertyCard';
import { HiAdjustments, HiX, HiSearch } from 'react-icons/hi';

const BrowseProperties = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { properties, pagination, loading, filters } = useSelector((state) => state.properties);
    const [showFilters, setShowFilters] = useState(false);

    // Sync URL params to filters on mount
    useEffect(() => {
        const params = {};
        for (const [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        if (Object.keys(params).length > 0) {
            dispatch(setFilters(params));
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

    const handleReset = () => {
        dispatch(resetFilters());
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Browse Properties</h1>
                        <p className="text-gray-500 dark:text-dark-text mt-1">
                            {pagination?.total || 0} properties found
                        </p>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        <HiAdjustments className="w-4 h-4" />
                        Filters
                    </button>
                </div>

                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <div className={`${showFilters ? 'fixed inset-0 z-50 p-4 bg-black/50 lg:relative lg:inset-auto lg:p-0 lg:bg-transparent' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}>
                        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 max-h-[80vh] lg:max-h-none overflow-y-auto lg:sticky lg:top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                                <div className="flex gap-2">
                                    <button onClick={handleReset} className="text-xs text-primary hover:text-primary-dark">Reset</button>
                                    <button onClick={() => setShowFilters(false)} className="lg:hidden"><HiX className="w-5 h-5 text-gray-500" /></button>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="mb-5">
                                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text mb-1.5">Search</label>
                                <div className="relative">
                                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div className="mb-5">
                                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text mb-1.5">Status</label>
                                <div className="flex gap-2">
                                    {['', 'For Sale', 'For Rent'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleFilterChange('status', s)}
                                            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${filters.status === s ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                                                }`}
                                        >
                                            {s || 'All'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Property Type */}
                            <div className="mb-5">
                                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text mb-1.5">Type</label>
                                <select
                                    value={filters.propertyType}
                                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                                    className="w-full py-2.5 px-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary"
                                >
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
                                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text mb-1.5">City</label>
                                <input
                                    type="text"
                                    placeholder="Enter city"
                                    value={filters.city}
                                    onChange={(e) => handleFilterChange('city', e.target.value)}
                                    className="w-full py-2.5 px-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary"
                                />
                            </div>

                            {/* Price Range */}
                            <div className="mb-5">
                                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text mb-1.5">Price Range</label>
                                <div className="flex gap-2">
                                    <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        className="w-1/2 py-2.5 px-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary" />
                                    <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        className="w-1/2 py-2.5 px-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary" />
                                </div>
                            </div>

                            {/* Bedrooms */}
                            <div className="mb-5">
                                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text mb-1.5">Bedrooms</label>
                                <div className="flex gap-2">
                                    {['', '1', '2', '3', '4'].map((b) => (
                                        <button key={b} onClick={() => handleFilterChange('bedrooms', b)}
                                            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${filters.bedrooms === b ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark text-gray-600 dark:text-gray-400'
                                                }`}
                                        >
                                            {b || 'Any'}
                                            {b && '+'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-dark-text mb-1.5">Sort By</label>
                                <select
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="w-full py-2.5 px-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="popular">Most Popular</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Property Grid */}
                    <div className="flex-1">
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
                            <div className="text-center py-20">
                                <p className="text-6xl mb-4">🏠</p>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No properties found</h3>
                                <p className="text-gray-500 dark:text-dark-text mt-2">Try adjusting your filters</p>
                                <button onClick={handleReset} className="mt-4 px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium">
                                    Reset Filters
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
                                    <div className="flex justify-center mt-10 gap-2">
                                        {Array.from({ length: pagination.pages }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleFilterChange('page', (i + 1).toString())}
                                                className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${pagination.page === i + 1
                                                        ? 'bg-primary text-white'
                                                        : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-border hover:border-primary'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrowseProperties;
