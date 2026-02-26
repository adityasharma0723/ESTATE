import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiLockClosed } from 'react-icons/hi';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
        setLoading(true);
        try {
            await API.put(`/auth/reset-password/${token}`, { password: form.password });
            toast.success('Password reset successfully!');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark pt-16 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiLockClosed className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
                    <p className="text-gray-500 dark:text-dark-text mt-1">Enter your new password below</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-8">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                        <input type="password" required minLength={6} value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary"
                            placeholder="Min. 6 characters" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                        <input type="password" required value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary"
                            placeholder="Confirm password" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold rounded-xl">
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
