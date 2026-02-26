import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { loadUser } from './store/slices/authSlice';
import { useDarkMode } from './hooks/useDarkMode';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/public/Home';
import BrowseProperties from './pages/public/BrowseProperties';
import PropertyDetails from './pages/public/PropertyDetails';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import FAQ from './pages/public/FAQ';
import Blog from './pages/public/Blog';
import BlogPost from './pages/public/BlogPost';
import NotFound from './pages/public/NotFound';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// User dashboard
import UserDashboard from './pages/user/UserDashboard';
import SavedProperties from './pages/user/SavedProperties';
import MyInquiries from './pages/user/MyInquiries';
import Settings from './pages/user/Settings';

// Agent dashboard
import AgentDashboard from './pages/agent/AgentDashboard';
import AddProperty from './pages/agent/AddProperty';
import MyListings from './pages/agent/MyListings';
import AgentAnalytics from './pages/agent/AgentAnalytics';

// Admin dashboard
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageAgents from './pages/admin/ManageAgents';
import ManageProperties from './pages/admin/ManageProperties';
import ManageReviews from './pages/admin/ManageReviews';
import ManageBlogs from './pages/admin/ManageBlogs';
import SiteAnalytics from './pages/admin/SiteAnalytics';

// Shared
import Chat from './pages/shared/Chat';

// Public layout with Navbar + Footer
const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

// Authenticated layout with Navbar only (no Footer for dashboards)
const AuthLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function App() {
  const dispatch = useDispatch();
  useDarkMode();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#1e1e2e', color: '#fff', borderRadius: '12px', fontSize: '14px' },
        }}
      />

      <Routes>
        {/* Public routes with Navbar + Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<BrowseProperties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Route>

        {/* Auth routes (no footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Chat (protected, all roles) */}
        <Route element={<AuthLayout />}>
          <Route element={<ProtectedRoute allowedRoles={['user', 'agent', 'admin']} />}>
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Route>

        {/* User dashboard routes */}
        <Route element={<AuthLayout />}>
          <Route element={<ProtectedRoute allowedRoles={['user', 'agent', 'admin']} />}>
            <Route element={<DashboardLayout role="user" />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/saved" element={<SavedProperties />} />
              <Route path="/inquiries" element={<MyInquiries />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Route>

        {/* Agent dashboard routes */}
        <Route element={<AuthLayout />}>
          <Route element={<ProtectedRoute allowedRoles={['agent', 'admin']} />}>
            <Route element={<DashboardLayout role="agent" />}>
              <Route path="/agent/dashboard" element={<AgentDashboard />} />
              <Route path="/agent/add-property" element={<AddProperty />} />
              <Route path="/agent/listings" element={<MyListings />} />
              <Route path="/agent/analytics" element={<AgentAnalytics />} />
            </Route>
          </Route>
        </Route>

        {/* Admin dashboard routes */}
        <Route element={<AuthLayout />}>
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout role="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/agents" element={<ManageAgents />} />
              <Route path="/admin/properties" element={<ManageProperties />} />
              <Route path="/admin/reviews" element={<ManageReviews />} />
              <Route path="/admin/blogs" element={<ManageBlogs />} />
              <Route path="/admin/analytics" element={<SiteAnalytics />} />
            </Route>
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
