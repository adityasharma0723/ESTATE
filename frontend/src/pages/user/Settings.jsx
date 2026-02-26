import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../../store/slices/authSlice';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const Settings = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [form, setForm] = useState({ name: '', phone: '', bio: '' });
    const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({ name: user.name || '', phone: user.phone || '', bio: user.bio || '' });
        }
    }, [user]);

    const handleProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.put(`/users/${user._id}`, form);
            toast.success('Profile updated!');
            dispatch(loadUser());
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
        setLoading(false);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile */}
                <form onSubmit={handleProfile} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl text-sm">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

                {/* Account info */}
                <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account</h2>
                    <dl className="space-y-4 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-gray-500 dark:text-dark-text">Email</dt>
                            <dd className="font-medium text-gray-900 dark:text-white">{user?.email}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-500 dark:text-dark-text">Role</dt>
                            <dd className="font-medium text-gray-900 dark:text-white capitalize">{user?.role}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-500 dark:text-dark-text">Member Since</dt>
                            <dd className="font-medium text-gray-900 dark:text-white">{new Date(user?.createdAt).toLocaleDateString()}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default Settings;
