import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { formatDate } from '../../utils/helpers';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

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
        { _id: '1', title: '10 Tips for First-Time Homebuyers in 2024', slug: 'tips-first-time-buyers', coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600', author: { name: 'EstateX Team' }, tags: ['Buying', 'Tips'], createdAt: new Date().toISOString() },
        { _id: '2', title: 'How to Stage Your Home for a Quick Sale', slug: 'home-staging-guide', coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600', author: { name: 'EstateX Team' }, tags: ['Selling', 'Guide'], createdAt: new Date().toISOString() },
        { _id: '3', title: 'Commercial Real Estate Trends to Watch', slug: 'commercial-trends', coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600', author: { name: 'EstateX Team' }, tags: ['Commercial', 'Trends'], createdAt: new Date().toISOString() },
        { _id: '4', title: 'Understanding Property Taxes in India', slug: 'property-taxes-india', coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600', author: { name: 'EstateX Team' }, tags: ['Finance', 'Guide'], createdAt: new Date().toISOString() },
        { _id: '5', title: 'Best Cities to Invest in Real Estate 2024', slug: 'best-cities-2024', coverImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600', author: { name: 'EstateX Team' }, tags: ['Investment'], createdAt: new Date().toISOString() },
        { _id: '6', title: 'Renting vs Buying: Which is Right for You?', slug: 'renting-vs-buying', coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600', author: { name: 'EstateX Team' }, tags: ['Buying', 'Renting'], createdAt: new Date().toISOString() },
    ];

    const displayBlogs = blogs.length > 0 ? blogs : placeholderBlogs;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
            <div className="bg-gradient-to-br from-primary to-secondary py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-white">EstateX Blog</h1>
                    <p className="mt-2 text-white/80">Insights, tips, and trends in real estate</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-dark-border">
                                <div className="h-48 skeleton" />
                                <div className="p-5 space-y-3"><div className="h-5 w-3/4 skeleton rounded" /><div className="h-4 w-1/2 skeleton rounded" /></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayBlogs.map((blog) => (
                            <Link key={blog._id} to={`/blog/${blog.slug}`}
                                className="group bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-dark-border hover:shadow-lg transition-all">
                                <div className="h-48 overflow-hidden">
                                    <img src={blog.coverImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'} alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="p-5">
                                    <div className="flex gap-2 mb-3">
                                        {blog.tags?.slice(0, 2).map((tag) => (
                                            <span key={tag} className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">{tag}</span>
                                        ))}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h3>
                                    <div className="flex items-center mt-3 text-xs text-gray-500 dark:text-dark-text">
                                        <span>{blog.author?.name}</span>
                                        <span className="mx-2">·</span>
                                        <span>{formatDate(blog.createdAt)}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
