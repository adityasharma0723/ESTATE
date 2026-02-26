import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../store/slices/uiSlice';

export const useDarkMode = () => {
    const dispatch = useDispatch();
    const { darkMode } = useSelector((state) => state.ui);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return {
        darkMode,
        toggle: () => dispatch(toggleDarkMode()),
    };
};
