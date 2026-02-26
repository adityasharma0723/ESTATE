import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiMenu, HiX, HiMoon, HiSun, HiUser, HiLogout, HiChat, HiHeart } from 'react-icons/hi';
import { toggleDarkMode } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { darkMode } = useSelector((state) => state.ui);

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/properties', label: 'Properties' },
        { to: '/about', label: 'About' },
        { to: '/blog', label: 'Blog' },
        { to: '/contact', label: 'Contact' },
    ];

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin/dashboard';
        if (user.role === 'agent') return '/agent/dashboard';
        return '/dashboard';
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark/80 backdrop-blur-xl border-b border-gray-200 dark:border-dark-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">E</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            Estate<span className="text-primary">X</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'text-primary bg-primary/10'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-dark-card'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center space-x-3">
                        <button
                            onClick={() => dispatch(toggleDarkMode())}
                            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/saved"
                                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                                >
                                    <HiHeart className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/chat"
                                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                                >
                                    <HiChat className="w-5 h-5" />
                                </Link>
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold">
                                            {user?.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                    </button>

                                    {profileOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-xl shadow-xl border border-gray-200 dark:border-dark-border py-2 animate-fade-in">
                                            <div className="px-4 py-2 border-b border-gray-100 dark:border-dark-border">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-dark-text">{user?.email}</p>
                                                <span className="inline-block mt-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                    {user?.role}
                                                </span>
                                            </div>
                                            <Link to={getDashboardLink()} onClick={() => setProfileOpen(false)} className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark/50">
                                                <HiUser className="w-4 h-4" /> <span>Dashboard</span>
                                            </Link>
                                            <button
                                                onClick={() => { dispatch(logout()); setProfileOpen(false); }}
                                                className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <HiLogout className="w-4 h-4" /> <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                                    Log in
                                </Link>
                                <Link to="/register" className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-primary/25">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400">
                        {open ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden bg-white dark:bg-dark border-t border-gray-200 dark:border-dark-border animate-fade-in">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}
                                className={({ isActive }) => `block px-4 py-2.5 rounded-lg text-sm font-medium ${isActive ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-300'}`}>
                                {link.label}
                            </NavLink>
                        ))}
                        <hr className="border-gray-200 dark:border-dark-border my-2" />
                        {isAuthenticated ? (
                            <>
                                <Link to={getDashboardLink()} onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300">Dashboard</Link>
                                <button onClick={() => { dispatch(logout()); setOpen(false); }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-600">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300">Log in</Link>
                                <Link to="/register" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-primary">Sign up</Link>
                            </>
                        )}
                        <button onClick={() => dispatch(toggleDarkMode())} className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300">
                            {darkMode ? <HiSun className="w-4 h-4" /> : <HiMoon className="w-4 h-4" />} <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
