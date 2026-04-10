import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { formatDate } from '../../utils/helpers';
import { HiBookOpen, HiTrendingUp, HiClock, HiArrowRight } from 'react-icons/hi';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTag, setActiveTag] = useState('All');

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const { data } = await API.get('/blogs');
                setBlogs(data.blogs);
            } catch { }
            setLoading(false);
        };
        fetchBlogs();
    }, []);

    const placeholderBlogs = [
        { _id: '1', title: '10 Tips for First-Time Homebuyers in 2024', excerpt: 'Navigate the complex world of real estate with confidence. From mortgage pre-approval to closing day, here\'s everything you need to know.', slug: 'tips-first-time-buyers', coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', author: { name: 'EstateX Team' }, tags: ['Buying', 'Tips'], readTime: '5 min', createdAt: new Date().toISOString() },
        { _id: '2', title: 'How to Stage Your Home for a Quick Sale', excerpt: 'First impressions matter. Learn the art of home staging to attract buyers and sell your property faster at the best price.', slug: 'home-staging-guide', coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', author: { name: 'EstateX Team' }, tags: ['Selling', 'Guide'], readTime: '7 min', createdAt: new Date().toISOString() },
        { _id: '3', title: 'Commercial Real Estate Trends to Watch', excerpt: 'The commercial market is evolving rapidly. Discover the key trends shaping office spaces, retail, and industrial real estate.', slug: 'commercial-trends', coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', author: { name: 'EstateX Team' }, tags: ['Commercial', 'Trends'], readTime: '6 min', createdAt: new Date().toISOString() },
        { _id: '4', title: 'Understanding Property Taxes in India', excerpt: 'A comprehensive guide to property taxation — from stamp duty and registration to annual property taxes across different states.', slug: 'property-taxes-india', coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800', author: { name: 'EstateX Team' }, tags: ['Finance', 'Guide'], readTime: '8 min', createdAt: new Date().toISOString() },
        { _id: '5', title: 'Best Cities to Invest in Real Estate 2024', excerpt: 'From Pune to Hyderabad, explore which Indian cities offer the best ROI and growth potential for real estate investors.', slug: 'best-cities-2024', coverImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', author: { name: 'EstateX Team' }, tags: ['Investment', 'Trends'], readTime: '6 min', createdAt: new Date().toISOString() },
        { _id: '6', title: 'Renting vs Buying: Which is Right for You?', excerpt: 'The age-old debate settled. Analyze your financial situation and lifestyle to make the right housing decision.', slug: 'renting-vs-buying', coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', author: { name: 'EstateX Team' }, tags: ['Buying', 'Renting'], readTime: '5 min', createdAt: new Date().toISOString() },
    ];

    const displayBlogs = blogs.length > 0 ? blogs : placeholderBlogs;
    const allTags = ['All', ...new Set(displayBlogs.flatMap(b => b.tags || []))];
    const filteredBlogs = activeTag === 'All' ? displayBlogs : displayBlogs.filter(b => b.tags?.includes(activeTag));
    const featured = filteredBlogs[0];
    const rest = filteredBlogs.slice(1);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
            {/* Hero — Image background with adaptive overlay (matching Home) */}
            <div className="relative min-h-[70vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
                        alt="Modern workspace"
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
                            <span className="text-sm text-gray-700 dark:text-white/80 font-medium">Fresh insights every week</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight animate-slide-up">
                            Insights for{' '}
                            <span className="bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent">
                                Smarter Decisions
                            </span>
                        </h1>
                        <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Expert articles, market trends, and practical tips to guide your real estate journey across India.
                        </p>
                        <div className="flex gap-8 mt-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            {[
                                { value: '50+', label: 'Articles' },
                                { value: '10K+', label: 'Readers' },
                                { value: '6', label: 'Categories' },
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

            {/* Featured Article — Two-column (matching About mission section) */}
            {!loading && featured && (
                <div className="max-w-7xl mx-auto px-4 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <Link to={`/blog/${featured.slug}`} className="block rounded-2xl overflow-hidden h-96 shadow-2xl group">
                                <img src={featured.coverImage} alt={featured.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </Link>
                            {/* Floating card */}
                            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border p-5 max-w-[220px]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                                        <HiTrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-lg">Featured</p>
                                        <p className="text-xs text-gray-500 dark:text-dark-text">Editor&apos;s Pick</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider rounded-full">
                                Featured Article
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 leading-tight">
                                {featured.title}
                            </h2>
                            <p className="mt-5 text-gray-600 dark:text-dark-text leading-relaxed">
                                {featured.excerpt}
                            </p>
                            <div className="flex gap-4 mt-6">
                                {featured.tags?.map(tag => (
                                    <div key={tag} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <span className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center text-xs">✓</span>
                                        {tag}
                                    </div>
                                ))}
                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                    <HiClock className="w-4 h-4" /> {featured.readTime || '5 min read'}
                                </div>
                            </div>
                            <Link to={`/blog/${featured.slug}`}
                                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors">
                                Read Article →
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Blog Grid — Card grid (matching About "Why Choose Us" section) */}
            <div className="bg-white dark:bg-dark-card border-y border-gray-100 dark:border-dark-border py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-14">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider rounded-full">
                            All Articles
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
                            Latest from Our Blog
                        </h2>
                        <p className="text-gray-500 dark:text-dark-text mt-2 max-w-md mx-auto">
                            Stay informed with expert insights on buying, selling, and investing in real estate.
                        </p>
                    </div>

                    {/* Tag filters */}
                    <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
                        {allTags.map(tag => (
                            <button key={tag} onClick={() => setActiveTag(tag)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTag === tag
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-50 dark:bg-dark text-gray-600 dark:text-dark-text border border-gray-100 dark:border-dark-border hover:border-primary/40 hover:text-primary'
                                    }`}>
                                {tag}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="rounded-2xl bg-gray-50 dark:bg-dark border border-gray-100 dark:border-dark-border overflow-hidden">
                                    <div className="h-48 skeleton" />
                                    <div className="p-6 space-y-3"><div className="h-5 w-3/4 skeleton rounded" /><div className="h-4 w-full skeleton rounded" /><div className="h-4 w-1/2 skeleton rounded" /></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(activeTag === 'All' ? rest : filteredBlogs).map((blog) => (
                                <Link key={blog._id} to={`/blog/${blog.slug}`}
                                    className="group p-0 rounded-2xl bg-gray-50 dark:bg-dark border border-gray-100 dark:border-dark-border hover:border-gray-200 dark:hover:border-dark-border hover:shadow-lg transition-all duration-300 overflow-hidden">
                                    <div className="h-48 overflow-hidden">
                                        <img src={blog.coverImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            {blog.tags?.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">{tag}</span>
                                            ))}
                                            <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                                                <HiClock className="w-3.5 h-3.5" /> {blog.readTime || '5 min'}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                            {blog.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-dark-text mt-2 leading-relaxed line-clamp-2">
                                            {blog.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 dark:border-dark-border">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                    {blog.author?.name?.charAt(0) || 'E'}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{blog.author?.name}</p>
                                                    <p className="text-[11px] text-gray-400">{formatDate(blog.createdAt)}</p>
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-card flex items-center justify-center group-hover:bg-primary group-hover:text-white text-gray-400 transition-all duration-300">
                                                <HiArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* CTA — Image background (matching About CTA section) */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="relative rounded-3xl overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1434082033009-b81d41d32e1c?w=1200&q=80"
                        alt="Newsletter"
                        className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/50 flex items-center">
                        <div className="px-10 sm:px-16 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-6">
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-white">Stay ahead of the market</h3>
                                <p className="text-white/60 mt-2">Get weekly insights delivered straight to your inbox.</p>
                            </div>
                            <div className="flex">
                                <input type="email" placeholder="Enter your email"
                                    className="px-5 py-3 rounded-l-xl bg-white/15 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 transition-colors w-60" />
                                <button className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-r-xl transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
