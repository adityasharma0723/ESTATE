import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import {
    HiHome, HiPlus, HiCollection, HiChartBar, HiUsers, HiShieldCheck,
    HiDocumentText, HiStar, HiCog, HiHeart, HiChat, HiX, HiClipboardList
} from 'react-icons/hi';

const Sidebar = ({ role }) => {
    const dispatch = useDispatch();
    const { sidebarOpen } = useSelector((state) => state.ui);

    const userLinks = [
        { to: '/dashboard', icon: HiHome, label: 'Dashboard' },
        { to: '/saved', icon: HiHeart, label: 'Saved Properties' },
        { to: '/inquiries', icon: HiClipboardList, label: 'My Inquiries' },
        { to: '/chat', icon: HiChat, label: 'Messages' },
        { to: '/settings', icon: HiCog, label: 'Settings' },
    ];

    const agentLinks = [
        { to: '/agent/dashboard', icon: HiHome, label: 'Dashboard' },
        { to: '/agent/add-property', icon: HiPlus, label: 'Add Property' },
        { to: '/agent/listings', icon: HiCollection, label: 'My Listings' },
        { to: '/agent/analytics', icon: HiChartBar, label: 'Analytics' },
        { to: '/chat', icon: HiChat, label: 'Messages' },
        { to: '/settings', icon: HiCog, label: 'Settings' },
    ];

    const adminLinks = [
        { to: '/admin/dashboard', icon: HiHome, label: 'Dashboard' },
        { to: '/admin/users', icon: HiUsers, label: 'Manage Users' },
        { to: '/admin/agents', icon: HiShieldCheck, label: 'Manage Agents' },
        { to: '/admin/properties', icon: HiCollection, label: 'Properties' },
        { to: '/admin/reviews', icon: HiStar, label: 'Reviews' },
        { to: '/admin/blogs', icon: HiDocumentText, label: 'Blog CMS' },
        { to: '/admin/analytics', icon: HiChartBar, label: 'Analytics' },
    ];

    const links = role === 'admin' ? adminLinks : role === 'agent' ? agentLinks : userLinks;

    return (
        <>
            {/* Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => dispatch(setSidebarOpen(false))} />
            )}

            <aside className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 lg:hidden">
                    <span className="font-semibold text-gray-900 dark:text-white">Menu</span>
                    <button onClick={() => dispatch(setSidebarOpen(false))}>
                        <HiX className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end
                            onClick={() => dispatch(setSidebarOpen(false))}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'text-primary bg-primary/10'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark/50'
                                }`
                            }
                        >
                            <link.icon className="w-5 h-5" />
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
