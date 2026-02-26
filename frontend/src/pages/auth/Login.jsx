import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
    const [showPass, setShowPass] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });

    useEffect(() => {
        if (isAuthenticated && user) {
            const dest = user.role === 'admin' ? '/admin/dashboard' : user.role === 'agent' ? '/agent/dashboard' : '/dashboard';
            navigate(dest);
        }
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()); }
    }, [error, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(form));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark pt-16 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">E</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">Estate<span className="text-primary">X</span></span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
                    <p className="text-gray-500 dark:text-dark-text mt-1">Sign in to continue to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-8 shadow-xl shadow-gray-100 dark:shadow-none">
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                        <div className="relative">
                            <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary"
                                placeholder="you@example.com" />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                        <div className="relative">
                            <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type={showPass ? 'text' : 'password'} required value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary"
                                placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                {showPass ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center">
                            <input type="checkbox" className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-dark">Forgot password?</Link>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary/25">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p className="text-center mt-6 text-sm text-gray-500 dark:text-dark-text">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="text-primary font-medium hover:text-primary-dark">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
