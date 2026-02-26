import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMail } from 'react-icons/hi';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/auth/forgot-password', { email });
            setSent(true);
            toast.success('Reset link sent to your email');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark pt-16 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiMail className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h1>
                    <p className="text-gray-500 dark:text-dark-text mt-1">Enter your email and we&apos;ll send a reset link</p>
                </div>

                {sent ? (
                    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-8 text-center">
                        <p className="text-4xl mb-4">📧</p>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Check Your Email</h2>
                        <p className="text-gray-500 dark:text-dark-text mt-2">We sent a password reset link to <strong>{email}</strong></p>
                        <Link to="/login" className="inline-block mt-6 text-primary font-medium hover:text-primary-dark">
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-8">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary"
                                placeholder="you@example.com" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold rounded-xl">
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                        <p className="text-center mt-4 text-sm text-gray-500">
                            <Link to="/login" className="text-primary font-medium">Back to Login</Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
