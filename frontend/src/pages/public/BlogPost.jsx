import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import { formatDate } from '../../utils/helpers';

const BlogPost = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await API.get(`/blogs/${slug}`);
                setBlog(data.blog);
            } catch { }
            setLoading(false);
        };
        fetchBlog();
    }, [slug]);

    if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-dark pt-24"><div className="max-w-3xl mx-auto px-4"><div className="h-64 skeleton rounded-2xl mb-8" /><div className="h-8 w-2/3 skeleton rounded mb-4" /><div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-4 skeleton rounded" />)}</div></div></div>;

    if (!blog) return <div className="min-h-screen bg-gray-50 dark:bg-dark pt-24 text-center"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Blog post not found</h2><Link to="/blog" className="text-primary mt-4 inline-block">← Back to Blog</Link></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
            <div className="max-w-3xl mx-auto px-4 py-12">
                <Link to="/blog" className="text-primary text-sm font-medium mb-6 inline-block">← Back to Blog</Link>
                {blog.coverImage && (
                    <img src={blog.coverImage} alt={blog.title} className="w-full h-64 sm:h-80 object-cover rounded-2xl mb-8" />
                )}
                <div className="flex gap-2 mb-4">
                    {blog.tags?.map((tag) => (
                        <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">{tag}</span>
                    ))}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{blog.title}</h1>
                <div className="flex items-center mt-4 mb-8 text-sm text-gray-500 dark:text-dark-text">
                    <span>By {blog.author?.name}</span>
                    <span className="mx-2">·</span>
                    <span>{formatDate(blog.createdAt)}</span>
                </div>
                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {blog.content}
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
