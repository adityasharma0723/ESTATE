import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return {
        user,
        isAuthenticated,
        loading,
        error,
        logout: handleLogout,
        isAgent: user?.role === 'agent',
        isAdmin: user?.role === 'admin',
        isUser: user?.role === 'user',
    };
};
