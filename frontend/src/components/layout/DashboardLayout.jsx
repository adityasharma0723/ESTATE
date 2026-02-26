import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './Sidebar';
import { HiMenu } from 'react-icons/hi';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const DashboardLayout = ({ role }) => {
    const dispatch = useDispatch();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark pt-16">
            <Sidebar role={role} />

            <div className="lg:ml-64 min-h-[calc(100vh-4rem)]">
                {/* Mobile header */}
                <div className="lg:hidden flex items-center px-4 py-3 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
                    <button onClick={() => dispatch(setSidebarOpen(true))} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark/50">
                        <HiMenu className="w-5 h-5" />
                    </button>
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Menu</span>
                </div>

                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
