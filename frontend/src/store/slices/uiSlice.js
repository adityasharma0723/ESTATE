import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        darkMode: localStorage.getItem('darkMode') === 'true',
        sidebarOpen: false,
        compareList: JSON.parse(localStorage.getItem('compareList') || '[]'),
    },
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
            localStorage.setItem('darkMode', state.darkMode);
            if (state.darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload;
        },
        addToCompare: (state, action) => {
            if (state.compareList.length < 3 && !state.compareList.find(p => p._id === action.payload._id)) {
                state.compareList.push(action.payload);
                localStorage.setItem('compareList', JSON.stringify(state.compareList));
            }
        },
        removeFromCompare: (state, action) => {
            state.compareList = state.compareList.filter(p => p._id !== action.payload);
            localStorage.setItem('compareList', JSON.stringify(state.compareList));
        },
        clearCompare: (state) => {
            state.compareList = [];
            localStorage.setItem('compareList', '[]');
        },
    },
});

export const {
    toggleDarkMode,
    toggleSidebar,
    setSidebarOpen,
    addToCompare,
    removeFromCompare,
    clearCompare,
} = uiSlice.actions;

export default uiSlice.reducer;
