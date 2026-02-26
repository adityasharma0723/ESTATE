import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiLocationMarker } from 'react-icons/hi';

const Hero = () => {
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState({
        city: '',
        propertyType: '',
        status: 'For Sale',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchData.city) params.set('city', searchData.city);
        if (searchData.propertyType) params.set('propertyType', searchData.propertyType);
        if (searchData.status) params.set('status', searchData.status);
        navigate(`/properties?${params.toString()}`);
    };

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
                    alt="Modern luxury home"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/70 to-dark/40" />
            </div>

            {/* Floating shapes */}
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                <div className="max-w-2xl">
                    {/* Badge */}
                    <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-sm text-white/80">Over 10,000+ properties listed</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight animate-slide-up">
                        Find Your{' '}
                        <span className="bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent">
                            Dream Home
                        </span>
                        , Effortlessly
                    </h1>

                    <p className="mt-6 text-lg text-gray-300 max-w-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Discover premium properties, connect with verified agents, and make your real estate journey seamless with EstateX.
                    </p>

                    {/* Search card */}
                    <form
                        onSubmit={handleSearch}
                        className="mt-10 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4 animate-slide-up"
                        style={{ animationDelay: '0.2s' }}
                    >
                        {/* Toggle */}
                        <div className="flex gap-2 mb-4">
                            {['For Sale', 'For Rent'].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setSearchData({ ...searchData, status })}
                                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${searchData.status === status
                                            ? 'bg-primary text-white'
                                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <HiLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Enter city or location"
                                    value={searchData.city}
                                    onChange={(e) => setSearchData({ ...searchData, city: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl focus:outline-none focus:border-primary"
                                />
                            </div>

                            <select
                                value={searchData.propertyType}
                                onChange={(e) => setSearchData({ ...searchData, propertyType: e.target.value })}
                                className="px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:outline-none focus:border-primary appearance-none"
                            >
                                <option value="" className="text-gray-900">All Types</option>
                                <option value="Apartment" className="text-gray-900">Apartment</option>
                                <option value="Villa" className="text-gray-900">Villa</option>
                                <option value="House" className="text-gray-900">House</option>
                                <option value="Plot" className="text-gray-900">Plot</option>
                                <option value="Commercial" className="text-gray-900">Commercial</option>
                                <option value="Penthouse" className="text-gray-900">Penthouse</option>
                            </select>

                            <button
                                type="submit"
                                className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                            >
                                <HiSearch className="w-5 h-5" />
                                <span>Search</span>
                            </button>
                        </div>
                    </form>

                    {/* Stats */}
                    <div className="mt-10 grid grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        {[
                            { value: '10K+', label: 'Listings' },
                            { value: '5K+', label: 'Happy Buyers' },
                            { value: '200+', label: 'Cities' },
                            { value: '500+', label: 'Agents' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center sm:text-left">
                                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                                <p className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
