import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import uiReducer from './slices/uiSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        properties: propertyReducer,
        ui: uiReducer,
        chat: chatReducer,
    },
});
