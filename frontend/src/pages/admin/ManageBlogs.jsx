import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { formatDate } from '../../utils/helpers';
import { HiTrash, HiPencil, HiPlus, HiEye, HiEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', content: '', tags: '', isPublished: true });

    const fetchBlogs = async () => {
        try {
            const { data } = await API.get('/blogs/admin/all');
            setBlogs(data.blogs);
        } catch { }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/blogs', form);
            toast.success('Blog created');
            setShowForm(false);
            setForm({ title: '', content: '', tags: '', isPublished: true });
            fetchBlogs();
        } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this blog?')) return;
        try {
            await API.delete(`/blogs/${id}`);
            toast.success('Blog deleted');
            fetchBlogs();
        } catch { toast.error('Failed'); }
    };

    const togglePublish = async (id, isPublished) => {
        try {
            await API.put(`/blogs/${id}`, { isPublished: !isPublished });
            toast.success(isPublished ? 'Unpublished' : 'Published');
            fetchBlogs();
        } catch { toast.error('Failed'); }
    };

    const inputCls = 'w-full px-4 py-2.5 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary';

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog CMS</h1>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl">
                    <HiPlus className="w-4 h-4" /> New Post
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 mb-6 space-y-4">
                    <input type="text" required placeholder="Blog title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
                    <textarea required rows={6} placeholder="Blog content..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={inputCls} />
                    <input type="text" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputCls} />
                    <div className="flex gap-3">
                        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium">Publish</button>
                        <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-100 dark:bg-dark text-gray-600 rounded-xl text-sm">Cancel</button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {blogs.map((blog) => (
                    <div key={blog._id} className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border p-5 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{blog.title}</h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-dark-text">
                                <span>{blog.author?.name}</span>
                                <span>·</span>
                                <span>{formatDate(blog.createdAt)}</span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {blog.isPublished ? 'Published' : 'Draft'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => togglePublish(blog._id, blog.isPublished)} className="p-2 rounded-lg bg-gray-100 dark:bg-dark text-gray-600 dark:text-gray-400 hover:bg-gray-200">
                                {blog.isPublished ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                            </button>
                            <button onClick={() => handleDelete(blog._id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><HiTrash className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageBlogs;
